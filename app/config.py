import os
from pydantic import BaseModel
from dotenv import load_dotenv
from engine.vault import decrypt_key

# Load .env file
load_dotenv()

class Settings(BaseModel):
    ASSISTANT_NAME: str = "Vocalis AI"
    APP_VERSION: str = "2.0.0"
    HOST: str = "127.0.0.1"
    PORT: int = 8005
    DEBUG: bool = True
    
    # Model configuration
    GEMINI_MODEL: str = "gemini-2.5-flash"
    FALLBACK_MODEL: str = "gemini-1.5-flash"
    
    # Secure API Key loading
    @property
    def GEMINI_API_KEY(self) -> str | None:
        key = decrypt_key()
        if not key:
            key = os.getenv("GEMINI_API_KEY")
        return key

    @property
    def GROQ_API_KEY(self) -> str | None:
        return os.getenv("GROQ_API_KEY")

settings = Settings()

