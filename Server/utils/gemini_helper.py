# utils/gemini_helper.py
import google.generativeai as genai

import os
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

# Load securely from environment
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise Exception("Gemini API key not found in environment variables.")

genai.configure(api_key=GEMINI_API_KEY)

# model = genai.GenerativeModel("gemini-pro")  # or gemini-1.5-pro
# model = genai.GenerativeModel("models/gemini-1.5-pro")
model = genai.GenerativeModel("models/gemini-1.5-flash")


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
