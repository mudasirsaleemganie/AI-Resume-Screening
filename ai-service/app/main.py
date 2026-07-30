import base64
import binascii
import os

from fastapi import Depends, FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

from .engine import analyze, extract_contact, extract_education, parse_file

app = FastAPI(title="Resume Screening AI", version="1.0.0", docs_url="/docs")


class AnalysisRequest(BaseModel):
    filename: str = Field(max_length=255)
    content_base64: str
    job_description: str = Field(min_length=20, max_length=12000)
    required_skills: list[str] = Field(default_factory=list, max_length=100)
    minimum_experience: float = Field(default=0, ge=0, le=50)


def verify_service(x_service_key: str = Header(default="")):
    expected = os.getenv("AI_SERVICE_KEY", "development-service-key")
    if x_service_key != expected:
        raise HTTPException(status_code=401, detail="Invalid service credentials")


@app.get("/health")
def health():
    return {"status": "ok", "service": "ai"}


@app.post("/analyze", dependencies=[Depends(verify_service)])
def analyze_resume(payload: AnalysisRequest):
    try:
        content = base64.b64decode(payload.content_base64, validate=True)
        if len(content) > 7 * 1024 * 1024:
            raise ValueError("File is too large")
        text = parse_file(payload.filename, content)
        contact = extract_contact(text)
        result = analyze(text, payload.job_description, payload.required_skills, payload.minimum_experience)
        return {
            "extracted": {
                **contact,
                "skills": result["skills"],
                "education": extract_education(text),
                "experienceYears": result["experienceYears"],
                "textPreview": text[:600],
            },
            "analysis": result["analysis"],
        }
    except (ValueError, binascii.Error) as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=422, detail="The document could not be parsed") from error

