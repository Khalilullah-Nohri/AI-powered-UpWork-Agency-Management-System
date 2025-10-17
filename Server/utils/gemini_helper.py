# utils/gemini_helper.py
import os
from dotenv import load_dotenv

# Use stable v1 endpoint
os.environ.setdefault("GOOGLE_API_USE_V1_ENDPOINT", "true")

import google.generativeai as genai

# Load environment
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise Exception("Gemini API key not found in environment variables.")

genai.configure(api_key=GEMINI_API_KEY)

"""
gemini_helper.py
───────────────────────────────────────────────
This utility module handles interaction with Google’s Gemini API.

✅ Features:
- Securely loads the Gemini API key from the environment (.env)
- Configures the SDK to use the stable v1 endpoint (long-term supported)
- Automatically detects and selects the latest stable Gemini Flash model
  (e.g. gemini-2.5-flash, gemini-3.0-flash, etc.)
- Provides a helper function `generate_bid_proposal()` that uses Gemini
  to generate personalized, professional UpWork proposals based on
  a job description and a candidate’s resume.

📦 Dependencies:
- python-dotenv
- google-generativeai >= 0.8.5

This module is designed to be **future-proof**:
If Google updates model names (e.g. 2.6, 3.0...), the selector will
automatically pick the newest compatible model without breaking.
───────────────────────────────────────────────
"""

def get_latest_gemini_model():
    """Return the newest stable Gemini Flash model that supports text generation."""
    available = list(genai.list_models())

    # Filter only stable text-generation models (not live/preview/audio/image)
    models = [
        m.name
        for m in available
        if "gemini" in m.name
        and "flash" in m.name
        and all(x not in m.name for x in ["live", "preview", "audio", "image", "thinking", "exp"])
    ]

    if not models:
        raise Exception("No stable Gemini Flash models found for text generation.")

    # Sort newest first (Google model names sort by recency)
    models.sort(reverse=True)

    print("✅ Using Gemini model:", models[0])
    return models[0]


model = genai.GenerativeModel(get_latest_gemini_model())


def generate_bid_proposal(job_description, resume_text):
    """
    Sends prompt to Gemini and returns proposal text.
    """
    prompt = f"""
    You are an expert freelance bidder.
    Given the job description and the resume of a candidate,
    write a professional, personalized proposal suitable for UpWork.

    Job Description:
    {job_description}

    Resume:
    {resume_text}

    Write a detailed and persuasive proposal.
    """

    response = model.generate_content(prompt)
    return response.text.strip()
