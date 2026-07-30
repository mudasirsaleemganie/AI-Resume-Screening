# Model card: Hybrid TF-IDF Skills v1.0

## Purpose

Support resume review by showing job-relevant evidence and a suggested technical role. The system must not independently decide who is interviewed, rejected or hired.

## Method

- Deterministic skill extraction from a versioned alias taxonomy
- TF-IDF word/bigram vectors with cosine similarity
- Experience parsing from explicit phrases and year ranges
- Weighted, explainable job-match score
- Role similarity against transparent technical role profiles

## Known limitations

- Image-only/scanned PDFs require OCR, which is not included.
- Non-standard resume layouts can reduce extraction quality.
- Inferred experience from years may include education/project time.
- Taxonomy-based role prediction only covers configured technical roles.
- Confidence is a normalized similarity indicator, not a probability of job success.
- Resume wording can affect semantic score even when capability is equal.

## Fair-use requirements

- Do not provide protected characteristics to the scoring service.
- Do not use name, email or phone in scoring.
- Require a recruiter to inspect evidence and make every decision.
- Offer candidates a correction/appeal route in a real deployment.
- Regularly compare outcomes across relevant groups using lawful, consented evaluation data.
- Document taxonomy/model changes and preserve evaluation results.

