import pytest
from app.services.document_parser import parse_candidate_profile, parse_job_description, extract_text_from_file
from app.services.interview_engine import (
    generate_first_question,
    evaluate_answer_and_generate_next,
    generate_coding_problem,
    run_code_execution,
    generate_final_report
)

@pytest.mark.asyncio
async def test_interview_01_document_parsing():
    sample_cv = """
    John Doe
    Email: john@example.com
    Skills: Python, React, WebSockets, MongoDB, FastAPI
    Experience: Built Streamify real-time streaming application using React, Node.js, and WebSockets.
    Education: B.Tech in Computer Science
    """
    profile = parse_candidate_profile(sample_cv)
    assert profile["name"] == "John Doe"
    assert "python" in profile["skills"]
    assert "react" in profile["skills"]
    assert len(profile["projects"]) > 0

@pytest.mark.asyncio
async def test_interview_02_jd_parsing():
    sample_jd = """
    We are looking for a Senior Full Stack Engineer.
    Required skills: Python, FastAPI, React, Docker, System Design.
    Responsibilities: Build scalable real-time APIs.
    """
    jd_data = parse_job_description(sample_jd)
    assert "python" in jd_data["required_skills"]
    assert "fastapi" in jd_data["required_skills"]
    assert jd_data["detected_domain"] == "Full Stack Development"

@pytest.mark.asyncio
async def test_interview_03_first_question_generation():
    cv_profile = {"name": "Alice", "skills": ["python", "websockets"], "projects": ["Built real-time chat app"]}
    jd_data = {"required_skills": ["python", "fastapi"]}
    res = generate_first_question(cv_profile, jd_data, "Full Stack Development", "1-3 Years", "Python")
    assert "question" in res
    assert res["category"] == "CV"
    assert len(res["activity_logs"]) > 0

@pytest.mark.asyncio
async def test_interview_04_answer_evaluation_and_adaptive_next():
    session_state = {
        "domain": "Backend Development",
        "experience_level": "1-3 Years",
        "language": "Python",
        "cv_profile": {"skills": ["python"]},
        "jd_data": {"required_skills": ["python"]},
        "questions_history": [],
        "current_question": {"question": "How do you handle WebSockets?"}
    }
    candidate_answer = "I used Socket.IO rooms for partitioning events."
    res = evaluate_answer_and_generate_next(session_state, candidate_answer)
    assert "evaluation font-bold" not in str(res)
    assert "evaluation" in res
    assert res["evaluation"]["score"] > 0
    assert "next_question" in res

@pytest.mark.asyncio
async def test_interview_05_coding_problem_and_execution():
    prob = generate_coding_problem("Full Stack Development", "Python")
    assert "title font-bold" not in str(prob)
    assert "title" in prob
    assert "test_cases" in prob
    
    code = "def solve(nums, target):\n    return [0, 1]\n"
    exec_res = run_code_execution(code, "Python", prob["test_cases"])
    assert exec_res["passed"] > 0
    assert exec_res["duration_ms"] >= 0

@pytest.mark.asyncio
async def test_interview_06_final_report_compilation():
    session_state = {
        "interview_id": "voc-test-101",
        "domain": "Full Stack Development",
        "cv_profile": {"name": "Bob", "skills": ["react", "node.js"]},
        "jd_data": {"required_skills": ["react", "node.js", "docker"]},
        "questions_history": [
            {
                "category": "CV",
                "question": "Tell me about React.",
                "answer": "React uses virtual DOM.",
                "evaluation": {"score": 8.5, "strengths": "Good core understanding", "weaknesses": "None"}
            }
        ]
    }
    report = generate_final_report(session_state)
    assert report["overall_score"] > 0
    assert "scores_breakdown" in report
    assert "communication_analysis font-bold" not in str(report)
    assert "communication_analysis" in report
    assert len(report["seven_day_roadmap"]) == 7
