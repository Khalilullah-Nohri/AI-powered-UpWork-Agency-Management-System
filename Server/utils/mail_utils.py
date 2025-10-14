# utils/mail_utils.py
# Handles sending job summary emails securely via SMTP

import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()  # Ensure .env values are loaded

def send_job_summary_email(to_email, subject, body):
    """
    Sends an email with the given subject and body using Outlook SMTP.
    """

    EMAIL_HOST = os.getenv("EMAIL_HOST")
    EMAIL_PORT = int(os.getenv("EMAIL_PORT"))
    EMAIL_USERNAME = os.getenv("EMAIL_USERNAME")
    EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

    msg = EmailMessage()
    msg['From'] = EMAIL_USERNAME
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.set_content(body)

    try:
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()  # Secure the connection
            server.login(EMAIL_USERNAME, EMAIL_PASSWORD)
            server.send_message(msg)
            print(f"✅ Email sent to {to_email}")
            return True
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        return False
