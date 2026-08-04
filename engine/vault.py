import os
from cryptography.fernet import Fernet

# Use absolute paths for reliability
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEY_FILE = os.path.join(BASE_DIR, ".key")
VAULT_FILE = os.path.join(BASE_DIR, ".vault")

def get_crypto_key():
    """Load or generate a master key for encryption."""
    if os.path.exists(KEY_FILE):
        with open(KEY_FILE, "rb") as f:
            return f.read()
    else:
        key = Fernet.generate_key()
        with open(KEY_FILE, "wb") as f:
            f.write(key)
        return key

def encrypt_key(plain_text: str):
    """Encrypt a string and save it to the vault."""
    f = Fernet(get_crypto_key())
    cipher_text = f.encrypt(plain_text.encode())
    with open(VAULT_FILE, "wb") as v:
        v.write(cipher_text)
    return cipher_text

def decrypt_key():
    """Load the encrypted key from the vault and decrypt it."""
    if not os.path.exists(VAULT_FILE):
        return None
    
    f = Fernet(get_crypto_key())
    with open(VAULT_FILE, "rb") as v:
        cipher_text = v.read()
    
    try:
        return f.decrypt(cipher_text).decode()
    except Exception:
        return None
