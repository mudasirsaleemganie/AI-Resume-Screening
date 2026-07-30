from app.engine import analyze, extract_education, extract_skills


def test_skill_aliases_are_canonicalized():
    skills = extract_skills("Built ReactJS applications with NodeJS, Mongoose and RESTful services.")
    assert "react" in skills
    assert "node.js" in skills
    assert "mongodb" in skills
    assert "rest api" in skills


def test_analysis_returns_explainable_scores():
    result = analyze(
        "MCA developer with React JavaScript Node.js Express MongoDB and Git project experience",
        "We need a React and Node.js developer using MongoDB and Git.",
        ["react", "node.js", "mongodb", "git"],
        0,
    )
    assert result["analysis"]["skillScore"] == 100
    assert result["analysis"]["predictedRole"]
    assert result["analysis"]["recommendations"]


def test_mca_education_extraction():
    assert "Master of Computer Applications (MCA)" in extract_education("Education: MCA, University of Kashmir")

