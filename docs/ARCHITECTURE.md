# Architecture and data flow

## Application flow

1. A candidate registers through the React client.
2. The Express API hashes the password and issues a signed JWT.
3. A recruiter creates a job with its description, skills and experience requirement.
4. A candidate uploads one PDF/DOCX resume for that job.
5. The API validates the file, stores it under a random name and sends only the document bytes plus job criteria to the internal AI service.
6. The AI service extracts text, contact fields, skills, education and experience.
7. It calculates explainable sub-scores and returns a role prediction.
8. The API stores the structured result with the application.
9. Candidates see their evidence and advice. Recruiters see ranked applicants and remain responsible for status decisions.
10. Important mutations are written to the audit collection.

## Collections

- `users`: identity, role, account status and login metadata
- `jobs`: position details, skill requirements, owner and publication status
- `applications`: resume reference, extracted information, model output and recruiter decision
- `audits`: actor, action, target, timestamp and request IP

## Production scaling

- Store resumes in private S3-compatible object storage rather than a shared disk.
- Place the API and AI service behind a reverse proxy with TLS.
- Run background analysis through a queue for large traffic.
- Restrict the AI service to a private network.
- Add replica sets, backups, monitoring and structured logs.
- Version the skill taxonomy and retain model evaluation reports.

