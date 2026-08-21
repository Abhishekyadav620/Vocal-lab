import io
import re
from typing import Dict, Any, List

def extract_text_from_file(filename: str, content_bytes: bytes) -> str:
    """Extract raw text from uploaded PDF, DOCX, or TXT file."""
    ext = filename.lower().split(".")[-1]
    
    if ext == "txt":
        try:
            return content_bytes.decode("utf-8")
        except UnicodeDecodeError:
            return content_bytes.decode("latin-1", errors="ignore")
            
    elif ext == "pdf":
        text = ""
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(content_bytes))
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        except Exception as e:
            text = f"PDF Text Extraction Warning: {str(e)}\n" + content_bytes.decode("utf-8", errors="ignore")
        return text if text.strip() else content_bytes.decode("utf-8", errors="ignore")

    elif ext in ["docx", "doc"]:
        text = ""
        try:
            import docx
            doc = docx.Document(io.BytesIO(content_bytes))
            for paragraph in doc.paragraphs:
                if paragraph.text:
                    text += paragraph.text + "\n"
        except Exception as e:
            text = f"DOCX Text Extraction Warning: {str(e)}\n" + content_bytes.decode("utf-8", errors="ignore")
        return text if text.strip() else content_bytes.decode("utf-8", errors="ignore")

    return content_bytes.decode("utf-8", errors="ignore")


def parse_candidate_profile(raw_text: str) -> Dict[str, Any]:
    """Parse CV text into structured candidate profile data."""
    text_lower = raw_text.lower()
    
    # Common tech skills dictionary for detection
    known_skills = [
        "python", "javascript", "typescript", "react", "next.js", "node.js", "express",
        "html", "css", "tailwind", "sql", "postgresql", "mongodb", "mysql", "redis",
        "c++", "c#", "java", "go", "golang", "rust", "docker", "kubernetes", "aws",
        "azure", "gcp", "git", "rest api", "graphql", "websockets", "fastapi", "django",
        "flask", "machine learning", "pytorch", "tensorflow", "scikit-learn", "pandas", "numpy"
    ]
    
    found_skills = [skill for skill in known_skills if skill in text_lower]
    
    # Extract candidate name candidate (first non-empty line or fallback)
    lines = [l.strip() for l in raw_text.splitlines() if l.strip()]
    candidate_name = "Candidate"
    if lines:
        first_line = lines[0]
        if len(first_line) < 40 and not any(k in first_line.lower() for k in ["resume", "cv", "curriculum", "email", "@"]):
            candidate_name = first_line

    # Simple project extraction heuristic
    projects = []
    project_keywords = ["project", "built", "developed", "created", "implemented"]
    for line in lines:
        if any(kw in line.lower() for kw in project_keywords) and len(line) > 20:
            projects.append(line[:120])
        if len(projects) >= 5:
            break
            
    return {
        "name": candidate_name,
        "raw_text": raw_text,
        "skills": list(set(found_skills)),
        "projects": projects,
        "education": "Degree in Computer Science / Engineering" if "computer" in text_lower or "b.tech" in text_lower or "bs" in text_lower else "Technical Background",
        "experience_hints": "Detected relevant projects and technical background."
    }


def parse_job_description(raw_text: str) -> Dict[str, Any]:
    """Parse Job Description text into structured JD requirements."""
    text_lower = raw_text.lower()
    
    known_skills = [
        "python", "javascript", "typescript", "react", "next.js", "node.js", "express",
        "sql", "postgresql", "mongodb", "redis", "c++", "java", "go", "rust", "docker",
        "kubernetes", "aws", "azure", "gcp", "fastapi", "system design", "rest api", "websockets"
    ]
    
    found_skills = [skill for skill in known_skills if skill in text_lower]
    
    # Domain detection
    detected_domain = "Full Stack Development"
    if "full stack" in text_lower:
        detected_domain = "Full Stack Development"
    elif "data science" in text_lower or "machine learning" in text_lower or "ai" in text_lower:
        detected_domain = "AI / ML & Data Science"
    elif "frontend" in text_lower:
        detected_domain = "Frontend Development"
    elif "backend" in text_lower or "node" in text_lower or "fastapi" in text_lower:
        detected_domain = "Backend Development"
    elif "devops" in text_lower or "cloud" in text_lower or "aws" in text_lower or "kubernetes" in text_lower:
        detected_domain = "DevOps & Cloud Engineering"
    elif "cybersecurity" in text_lower or "security" in text_lower:
        detected_domain = "Cybersecurity"
        
    return {
        "raw_text": raw_text,
        "required_skills": list(set(found_skills)),
        "detected_domain": detected_domain,
        "summary": raw_text[:400] + "..." if len(raw_text) > 400 else raw_text
    }
