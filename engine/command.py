import pyttsx3
import speech_recognition as sr
import eel
import time
import re
import os
import webbrowser
from datetime import datetime
from gtts import gTTS
import pygame
import tempfile
import json
import psutil
import socket


# ==================== LANGUAGE DETECTION ====================
HINDI_WORDS = {
    'kya', 'hai', 'kaise', 'hain', 'mujhe', 'batao', 'bhai', 'yaar', 'aur',
    'karo', 'karke', 'bata', 'mera', 'tera', 'hum', 'tum', 'kuch', 'nahi',
    'acha', 'theek', 'kholo', 'band', 'sunao', 'dikhao', 'kab',
    'kahan', 'kisko', 'kitna', 'kyun', 'abhi', 'bahut', 'accha', 'suno',
    'bol', 'bolo', 'dekho', 'jao', 'padho', 'likho', 'samjho', 'socho',
    'chalo', 'wala', 'wali', 'raha', 'rahi', 'hoga', 'hogi', 'tha', 'thi',
    'par', 'lekin', 'phir', 'matlab', 'samay', 'din', 'raat', 'subah',
    'shaam', 'namaste', 'dhanyawaad', 'shukriya', 'maaf',
    'hal', 'ho'
}

BENGALI_WORDS = {
    'ki', 'kemon', 'acho', 'koro', 'bolo', 'amake', 'tumi', 'ami',
    'ache', 'holo', 'kore', 'dao', 'bol', 'dekho', 'jao', 'eso',
    'kothay', 'keno', 'kokhon', 'koto', 'bhalo', 'kharap', 'ebar',
    'ekhon', 'pore', 'age', 'dhonnobad', 'dada', 'didi', 'bhai',
    'ar', 'ba', 'ta', 'eta', 'oita', 'shob', 'kichu', 'nei',
    'hobe', 'korbo', 'jabo', 'khabo', 'dekhbo', 'bolbo', 'likhbo',
    'sunbo', 'amar', 'tomar', 'apnar', 'shomoy', 'aj', 'kal'
}


def detectLanguage(text):
    if not text:
        return 'en'

    # Check for Devanagari (Hindi) script
    if re.search(r'[\u0900-\u097F]', text):
        return 'hi'

    # Check for Bengali script
    if re.search(r'[\u0980-\u09FF]', text):
        return 'bn'

    # Romanized detection
    words = set(text.lower().split())
    hindi_score = len(words & HINDI_WORDS)
    bengali_score = len(words & BENGALI_WORDS)

    if hindi_score >= 2 and hindi_score >= bengali_score:
        return 'hi'
    if bengali_score >= 2 and bengali_score > hindi_score:
        return 'bn'

    return 'en'


def detectTargetLanguage(text):
    """Detect if the user is requesting a response in a specific language.
    E.g., 'tell me a poem in bengali' → 'bn', 'hindi mein batao' → 'hi'
    """
    q = text.lower()
    # Bengali target
    bn_patterns = ['in bengali', 'in bangla', 'bengali mein', 'bangla te', 'banglay']
    for p in bn_patterns:
        if p in q:
            return 'bn'
    # Hindi target
    hi_patterns = ['in hindi', 'hindi mein', 'hindi me', 'hindi mai']
    for p in hi_patterns:
        if p in q:
            return 'hi'
    # English target
    en_patterns = ['in english', 'english mein', 'english me']
    for p in en_patterns:
        if p in q:
            return 'en'
    return None


# ==================== SPEECH ENGINE ====================
import edge_tts
import asyncio

pygame.mixer.init()

# Premium neural voices from Microsoft Edge TTS
EDGE_VOICES = {
    'en': 'en-US-AriaNeural',       # Natural, warm female voice
    'hi': 'hi-IN-SwaraNeural',      # Natural Hindi female voice
    'bn': 'bn-IN-TanishaaNeural',   # Natural Bengali female voice
}


async def _edge_tts_generate(text, voice, filepath):
    """Generate speech audio using Edge TTS neural voice."""
    communicate = edge_tts.Communicate(text, voice, rate='+8%', pitch='+5Hz')
    await communicate.save(filepath)


def _playAudioFile(filepath):
    """Play an audio file through pygame and clean up."""
    pygame.mixer.music.load(filepath)
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        time.sleep(0.1)
    pygame.mixer.music.unload()
    try:
        os.remove(filepath)
    except Exception:
        pass


def _speakWithEdgeTTS(text, lang='en'):
    """Primary TTS: Microsoft Edge neural voices (best quality)."""
    try:
        voice = EDGE_VOICES.get(lang, EDGE_VOICES['en'])
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as f:
            filepath = f.name
        loop = asyncio.new_event_loop()
        try:
            loop.run_until_complete(_edge_tts_generate(text, voice, filepath))
        finally:
            loop.close()
        _playAudioFile(filepath)
    except Exception as e:
        print(f"Edge TTS error: {e}, falling back to gTTS")
        _speakWithGTTS(text, lang)


def _speakWithGTTS(text, lang='en'):
    """Fallback TTS: Google Text-to-Speech."""
    try:
        tts = gTTS(text=text, lang=lang, slow=False)
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as f:
            filepath = f.name
        tts.save(filepath)
        _playAudioFile(filepath)
    except Exception as e:
        print(f"gTTS error: {e}, falling back to pyttsx3")
        _speakWithPyttsx3(text, lang)


def _speakWithPyttsx3(text, lang='en'):
    """Last resort TTS: offline pyttsx3 (Windows SAPI5)."""
    try:
        engine = pyttsx3.init('sapi5')
        engine.setProperty('rate', 174)
        engine.setProperty('volume', 1.0)
        engine.say(text)
        engine.runAndWait()
        engine.stop()
    except Exception as e:
        print(f"pyttsx3 error: {e} — all TTS engines failed")


def speak(text, lang=None):
    text = str(text)
    if not text.strip():
        return

    if lang is None:
        lang = detectLanguage(text)

    eel.DisplayMessage(text)
    eel.receiverText(text)

    # Use Edge TTS neural voices (premium quality), with gTTS and pyttsx3 as fallbacks
    _speakWithEdgeTTS(text, lang if lang in ('hi', 'bn', 'en') else 'en')


# ==================== SPEECH RECOGNITION ====================
def takecommand():
    r = sr.Recognizer()
    try:
        with sr.Microphone() as source:
            print('listening....')
            eel.DisplayMessage('listening....')
            r.pause_threshold = 1
            r.adjust_for_ambient_noise(source, duration=0.8)
            if r.energy_threshold < 300:
                r.energy_threshold = 300
            print(f"Adjusted Energy threshold: {r.energy_threshold}")
            audio = r.listen(source, timeout=10, phrase_time_limit=6)

        print('recognizing...')
        eel.DisplayMessage('recognizing....')

        try:
            query = r.recognize_google(audio, language='en-in')
        except sr.UnknownValueError:
            print("English recognition failed, trying Hindi...")
            try:
                query = r.recognize_google(audio, language='hi-IN')
            except sr.UnknownValueError:
                print("Google Speech Recognition could not understand audio in English or Hindi")
                return ""

        print(f"user said: {query}")
        eel.DisplayMessage(query)
        return query.lower()

    except sr.WaitTimeoutError:
        print("Listening timed out — no speech detected. Please try again.")
        eel.DisplayMessage("Listening timed out. Please try again.")
        return ""
    except sr.RequestError as e:
        print(f"Could not request results from Google Speech Recognition service; {e}")
        return ""
    except Exception as e:
        print(f"takecommand error: {e}")
        return ""



# ==================== COMMAND SPLITTING ====================
def splitCompoundCommand(query):
    splitters = [' and also ', ' and then ', ' also ', ' aur ', ' then ', ' and ']
    parts = [query]
    for splitter in splitters:
        new_parts = []
        for part in parts:
            new_parts.extend(part.split(splitter))
        parts = new_parts
    return [p.strip() for p in parts if p.strip()]


# ==================== INTENT CLASSIFICATION ====================
def classifyIntent(query):
    q = query.lower().strip()

    # Identity
    identity_patterns = [
        'who are you', 'who r u', 'what are you', 'what is your name',
        'whats your name', "what's your name", 'tell me your name', 
        'your name', 'kya naam', 'kaun ho',
        'introduce yourself',
        'tu kaun hai', 'tum kaun ho', 'aap kaun', 'tera naam kya',
        'tumhara naam', 'apka naam', 'kaun ho tum',
        'tumi ke', 'tui ke', 'apni ke', 'tomar naam ki', 'ki naam tomar',
        'ke tumi', 'নাম কি', 'তুমি কে', 'आप कौन', 'तुम कौन', 'तेरा नाम'
    ]
    for pattern in identity_patterns:
        if pattern in q:
            return 'identity', q

    # Time
    time_patterns = [
        'what time', 'what is the time', 'current time', 'tell me the time',
        'time now', "what's the time", 'time please', 'kitna baj',
        'kya time', 'samay', 'time bata', 'samay kya', 'kya samay',
        'koyta baje', 'shomoy ki', 'ki shomoy'
    ]
    for pattern in time_patterns:
        if pattern in q:
            return 'time', q

    # Date
    date_patterns = [
        'what date', 'what is the date', 'current date', "today's date",
        'what day', 'aaj kya date', 'tarikh', 'aaj ki tarikh',
        'ajker tarikh', 'ki din'
    ]
    for pattern in date_patterns:
        if pattern in q:
            return 'date', q

    # YouTube
    if 'on youtube' in q or 'youtube pe' in q or 'youtube par' in q or 'youtube e' in q:
        return 'youtube', q
    if q.startswith('play ') or q.startswith('bajao '):
        return 'youtube', q

    # Quick message: "message maa I will be late"
    msg_patterns = [r'^message\s+(\S+)\s+(.+)', r'^msg\s+(\S+)\s+(.+)']
    for pattern in msg_patterns:
        match = re.match(pattern, q)
        if match:
            return 'quick_message', (match.group(1), match.group(2))

    # Search
    search_patterns = [
        'google search ', 'search for ', 'search karo ',
        'look up ', 'find out ', 'lookup ',
        'khojo ', 'dhundho ', 'search '
    ]
    for pattern in search_patterns:
        if q.startswith(pattern):
            term = q[len(pattern):].strip()
            return 'search', term

    # Open app/site
    open_patterns = ['open ', 'launch ', 'start ', 'kholo ', 'chalu kar ', 'kholun ']
    for pattern in open_patterns:
        if q.startswith(pattern):
            target = q.replace(pattern, '', 1).strip()
            return 'open', target

    # Website URL detection (must be a single word without spaces)
    if ' ' not in q and re.match(r'^[a-zA-Z0-9-]+\.(com|in|org|net|io|co|dev|me)$', q):
        return 'open', q

    # Messaging / Calls
    if 'send message' in q or 'phone call' in q or 'video call' in q:
        return 'communication', q

    # Fallback to AI
    return 'ai', q


# ==================== ACTION HANDLERS ====================

IDENTITY_RESPONSES = {
    'en': "I am JARVIS, created by Tushar. I'm his personal AI assistant. I help him execute tasks, answer questions, and manage his digital life intelligently.",
    'hi': "मैं जार्विस हूँ, मुझे तुषार ने बनाया है। मैं उनका पर्सनल AI असिस्टेंट हूँ। मैं उनके लिए काम करता हूँ और उनकी मदद करता हूँ।",
    'bn': "আমি জার্ভিস, আমাকে তুষার তৈরি করেছে। আমি তার পার্সোনাল AI অ্যাসিস্ট্যান্ট। আমি তার কাজে সাহায্য করি এবং তার ডিজিটাল জীবন পরিচালনা করি।",
}


def handleIdentity(lang='en'):
    response = IDENTITY_RESPONSES.get(lang, IDENTITY_RESPONSES['en'])
    speak(response, lang)


def handleTime(lang='en'):
    now = datetime.now()
    time_str = now.strftime("%I:%M %p")
    if lang == 'hi':
        speak(f"Sir, अभी समय {time_str} है।", 'hi')
    elif lang == 'bn':
        speak(f"Sir, এখন সময় {time_str}।", 'bn')
    else:
        speak(f"Sir, the current time is {time_str}.", 'en')


def handleDate(lang='en'):
    now = datetime.now()
    date_str = now.strftime("%A, %B %d, %Y")
    if lang == 'hi':
        speak(f"Sir, आज की तारीख है {date_str}।", 'hi')
    elif lang == 'bn':
        speak(f"Sir, আজকের তারিখ হলো {date_str}।", 'bn')
    else:
        speak(f"Sir, today is {date_str}.", 'en')


def handleSearch(term):
    if not term:
        speak("What would you like me to search for, Sir?")
        return
    speak(f"Searching for {term}, Sir.")
    url = f"https://www.google.com/search?q={term.replace(' ', '+')}"
    webbrowser.open(url)


def handleOpen(target):
    from engine.features import openCommand
    openCommand("open " + target)


def handleYoutube(query):
    from engine.features import PlayYoutube
    PlayYoutube(query)


def handleQuickMessage(contact_name, message_text):
    from engine.features import findContact, whatsApp
    speak(f"Sending message to {contact_name}")
    contact_no, name = findContact(f"send message to {contact_name}")
    if contact_no != 0:
        whatsApp(contact_no, message_text, 'message', name)
    else:
        speak(f"Sorry Sir, I couldn't find {contact_name} in your contacts.")


def handleCommunication(query):
    from engine.features import findContact, whatsApp, makeCall, sendMessage
    contact_no, name = findContact(query)
    if contact_no != 0:
        speak("Which mode you want to use Sir, WhatsApp or mobile?")
        preference = takecommand()
        print(preference)

        if not preference:
            speak("I didn't get a response, Sir. Please try again.")
            return

        if "mobile" in preference:
            if "send message" in query or "send sms" in query:
                speak("What message should I send, Sir?")
                msg_text = takecommand()
                if not msg_text:
                    speak("I didn't catch the message, Sir. Please try again.")
                    return
                sendMessage(msg_text, contact_no, name)
            elif "phone call" in query:
                makeCall(name, contact_no)
            else:
                speak("I didn't catch that, Sir. Please try again.")
        elif "whatsapp" in preference:
            if "send message" in query:
                speak("What message should I send, Sir?")
                msg_text = takecommand()
                if not msg_text:
                    speak("I didn't catch the message, Sir. Please try again.")
                    return
                whatsApp(contact_no, msg_text, 'message', name)
            elif "phone call" in query:
                whatsApp(contact_no, '', 'call', name)
            else:
                whatsApp(contact_no, '', 'video call', name)
        else:
            speak("I didn't catch that, Sir. Please say WhatsApp or mobile.")


def handleAI(query, lang='en'):
    from engine.features import chatBot
    # Check if user wants response in a specific language
    target = detectTargetLanguage(query)
    if target:
        lang = target
    chatBot(query, lang)


# ==================== MAIN COMMAND PROCESSOR ====================
@eel.expose
def allCommands(message=1):
    if message == 1:
        query = takecommand()
        print(query)
        eel.senderText(query)
    else:
        query = str(message).lower()
        eel.senderText(query)

    if not query or query.strip() == "":
        eel.ShowHood()
        return

    try:
        lang = detectLanguage(query)
        sub_commands = splitCompoundCommand(query)
        
        # Hybrid Decision: Identify if sub_commands are local actions or require AI
        tasks = []
        for cmd in sub_commands:
            intent, data = classifyIntent(cmd)
            tasks.append({'intent': intent, 'data': data, 'cmd': cmd})

        # Process each task
        for task in tasks:
            intent = task['intent']
            data = task['data']
            cmd = task['cmd']

            # ACTION SYSTEM: Local Tasks (No AI API)
            if intent != 'ai':
                # Generate Structured Action Response for logs/console
                action_plan = {
                    "type": "action",
                    "intent": intent,
                    "language": lang,
                    "actions": []
                }
                
                if intent == 'identity':
                    action_plan["actions"].append({"type": "respond", "content": "identity_info"})
                    handleIdentity(lang)
                elif intent == 'time':
                    action_plan["actions"].append({"type": "get_system_info", "target": "time"})
                    handleTime(lang)
                elif intent == 'date':
                    action_plan["actions"].append({"type": "get_system_info", "target": "date"})
                    handleDate(lang)
                elif intent == 'search':
                    action_plan["actions"].append({"type": "open_browser", "action": "google_search", "query": data})
                    handleSearch(data)
                elif intent == 'open':
                    action_plan["actions"].append({"type": "launch", "target": data})
                    handleOpen(data)
                elif intent == 'youtube':
                    action_plan["actions"].append({"type": "open_url", "target": "youtube", "query": data})
                    handleYoutube(data)
                elif intent == 'quick_message':
                    contact_name, msg_text = data
                    action_plan["actions"].append({"type": "messaging", "contact": contact_name, "message": msg_text})
                    handleQuickMessage(contact_name, msg_text)
                elif intent == 'communication':
                    action_plan["actions"].append({"type": "interactive_workflow", "task": "communication"})
                    handleCommunication(data)
                
                print(f"[JARVIS Action Plan]\n{json.dumps(action_plan, indent=2)}")

            # AI SYSTEM: General Knowledge / Conversation (Use API)
            else:
                print(f"[JARVIS Decision] AI API required for: '{cmd}'")
                handleAI(data, lang)

    except Exception as e:
        print("error: ", e)

    eel.ShowHood()


# ==================== REAL-TIME SYSTEM STATS ====================
@eel.expose
def getSystemStats():
    cpu = psutil.cpu_percent(interval=0)
    ram = psutil.virtual_memory()
    disks = {}
    for p in psutil.disk_partitions():
        try:
            u = psutil.disk_usage(p.mountpoint)
            disks[p.device.replace('\\', '')] = round(u.percent, 1)
        except Exception:
            pass
    net = psutil.net_io_counters()
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
    except Exception:
        ip = '0.0.0.0'
    return {
        'cpu': cpu, 'ram': ram.percent,
        'ram_used': round(ram.used / (1024**3), 1),
        'ram_total': round(ram.total / (1024**3), 1),
        'disks': disks,
        'net_sent': round(net.bytes_sent / (1024**2), 1),
        'net_recv': round(net.bytes_recv / (1024**2), 1),
        'ip': ip
    }