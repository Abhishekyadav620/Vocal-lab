import os
import sqlite3

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "jarvis.db")

def init_db():
    con = sqlite3.connect(DB_PATH)
    cursor = con.cursor()

    # Base Jarvis tables
    cursor.execute("CREATE TABLE IF NOT EXISTS sys_command(id integer primary key, name VARCHAR(100), path VARCHAR(1000))")
    cursor.execute("CREATE TABLE IF NOT EXISTS web_command(id integer primary key, name VARCHAR(100), url VARCHAR(1000))")
    cursor.execute("CREATE TABLE IF NOT EXISTS contacts(id integer primary key, name VARCHAR(200), mobile_no VARCHAR(255), email VARCHAR(255) NULL)")

    # Vocalis Interview Protocol tables
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS interviews (
        interview_id TEXT PRIMARY KEY,
        user_id TEXT,
        domain TEXT,
        experience_level TEXT,
        language TEXT,
        cv_text TEXT,
        jd_text TEXT,
        start_time REAL,
        end_time REAL,
        status TEXT,
        violation_count INTEGER DEFAULT 0,
        scores_json TEXT,
        report_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS interview_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        interview_id TEXT,
        question_num INTEGER,
        category TEXT,
        question_text TEXT,
        answer_text TEXT,
        evaluation_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(interview_id) REFERENCES interviews(interview_id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS coding_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        interview_id TEXT,
        problem_title TEXT,
        code TEXT,
        language TEXT,
        passed_count INTEGER,
        total_count INTEGER,
        stdout TEXT,
        stderr TEXT,
        analysis_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(interview_id) REFERENCES interviews(interview_id)
    )
    """)

    con.commit()
    con.close()

# Execute database initialization
init_db()