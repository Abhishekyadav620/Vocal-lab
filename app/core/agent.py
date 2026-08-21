import time
import os
from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from google import genai
from google.genai import types

from app.config import settings
from app.core.speech_service import detect_language, detect_target_language
from app.core.tools import launch_target, search_web, play_youtube, get_system_stats
from app.core.rag import rag_store
from app.core.guardrails import evaluate_guardrails

class AgentResponse(BaseModel):
    reply_text: str
    language: str
    confidence: float
    intent: str
    actions_executed: List[Dict[str, Any]]
    needs_confirmation: bool = False
    confirmation_reason: Optional[str] = None
    citations: List[str] = []
    latency_ms: float
    token_usage: Dict[str, int] = {}

VOCALIS_PERSONA = (
    "You are Vocalis AI, a cutting-edge multimodal voice & vision operating system. "
    "You are intelligent, concise, highly capable, and sleek in tone. "
    "Address the user politely (or as Sir/Ma'am if appropriate). "
    "Keep voice responses natural and crisp (2-3 sentences max). "
    "When a user asks about what is on their screen or camera, analyze the provided visual frame in detail."
)

_client = None

def get_genai_client():
    global _client
    if _client is None and settings.GEMINI_API_KEY:
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client

async def process_turn(
    user_query: str,
    image_bytes: Optional[bytes] = None,
    client_lang: Optional[str] = None,
    allow_actions: bool = True
) -> AgentResponse:
    start_time = time.time()
    q = user_query.strip()
    detected_lang = client_lang or detect_language(q)
    target_lang = detect_target_language(q) or detected_lang

    actions_executed = []
    citations = []
    confidence = 0.95
    intent = "general_ai"
    needs_confirmation = False
    confirmation_reason = None
    reply_text = ""

    # Check for direct local tool triggers if no image is attached
    if not image_bytes:
        q_lower = q.lower()
        if q_lower.startswith("open ") or q_lower.startswith("launch ") or q_lower.startswith("kholo "):
            target = q_lower.replace("open ", "").replace("launch ", "").replace("kholo ", "").strip()
            intent = "app_launch"
            safe, reason = evaluate_guardrails(intent, {"action": "launch", "target": target}, confidence)
            if safe and allow_actions:
                res = launch_target(target)
                actions_executed.append(res)
                reply_text = f"Opening {target}."
            else:
                needs_confirmation = not safe
                confirmation_reason = reason
                reply_text = f"Ready to open {target}. Awaiting confirmation."
        elif q_lower.startswith("play ") or q_lower.startswith("bajao ") or "on youtube" in q_lower:
            intent = "youtube"
            if allow_actions:
                res = play_youtube(q)
                actions_executed.append(res)
            reply_text = f"Playing {q} on YouTube."
        elif q_lower.startswith("search for ") or q_lower.startswith("google "):
            term = q_lower.replace("search for ", "").replace("google ", "").strip()
            intent = "web_search"
            if allow_actions:
                res = search_web(term)
                actions_executed.append(res)
            reply_text = f"Searching for {term}."
        elif "system stats" in q_lower or "cpu usage" in q_lower or "ram usage" in q_lower or "battery" in q_lower:
            intent = "system_telemetry"
            stats = get_system_stats()
            actions_executed.append({"status": "success", "action": "system_stats", "data": stats})
            reply_text = f"CPU is at {stats['cpu_percent']}%, and RAM usage is {stats['ram_percent']}% ({stats['ram_used_gb']}GB of {stats['ram_total_gb']}GB)."

    # If already handled by deterministic tools
    if reply_text:
        latency = max(0.1, round((time.time() - start_time) * 1000, 2))
        return AgentResponse(
            reply_text=reply_text,
            language=target_lang,
            confidence=confidence,
            intent=intent,
            actions_executed=actions_executed,
            needs_confirmation=needs_confirmation,
            confirmation_reason=confirmation_reason,
            citations=citations,
            latency_ms=latency,
            token_usage={"prompt_tokens": 0, "response_tokens": 0}
        )

    # Retrieval Grounding (RAG)
    rag_docs = rag_store.search(q, top_k=2)
    rag_context = ""
    if rag_docs:
        rag_context = "\n\nRelevant Grounded Knowledge:\n" + "\n".join(
            [f"- [{d['title']}]: {d['content']}" for d in rag_docs]
        )
        citations = [d['title'] for d in rag_docs]

    # Multimodal / LLM processing
    genai_client = get_genai_client()
    if genai_client is None:
        # Fallback without API key
        return AgentResponse(
            reply_text="Vocalis AI is running in local offline mode. Gemini API Key is not configured in the vault.",
            language=target_lang,
            confidence=0.60,
            intent="offline_fallback",
            actions_executed=[],
            latency_ms=max(0.1, round((time.time() - start_time) * 1000, 2))
        )

    try:
        lang_prompt = f" Respond in {target_lang}."
        if target_lang == 'hi':
            lang_prompt = " Respond ONLY in Hindi (Devanagari script)."
        elif target_lang == 'bn':
            lang_prompt = " Respond ONLY in Bengali (Bengali script)."

        full_prompt = f"{VOCALIS_PERSONA}\n{lang_prompt}{rag_context}\n\nUser Question: {q}"

        contents = []
        if image_bytes:
            contents.append(
                types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg")
            )
            intent = "multimodal_vision"
        contents.append(full_prompt)

        response = genai_client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=contents,
        )
        
        reply_text = response.text or "I processed your request."
        confidence = 0.96

    except Exception as e:
        reply_text = f"An issue occurred while consulting the intelligence engine: {str(e)}"
        confidence = 0.50

    latency = max(0.1, round((time.time() - start_time) * 1000, 2))
    return AgentResponse(
        reply_text=reply_text,
        language=target_lang,
        confidence=confidence,
        intent=intent,
        actions_executed=actions_executed,
        needs_confirmation=needs_confirmation,
        confirmation_reason=confirmation_reason,
        citations=citations,
        latency_ms=latency,
        token_usage={"prompt_tokens": 150, "response_tokens": 50}
    )
