# utils/scraper.py

import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from models import db
from models.job import Job
from utils.feasibility import evaluate_feasibility
import time
from utils.resume_matcher import calculate_match_score

# Load resume from file or static text (until frontend uploads)
RESUME_TEXT = """
Experienced Python developer with expertise in automation, REST APIs, web scraping, Flask, and cloud deployments.
Worked on several freelance projects involving backend systems, microservices, and CI/CD pipelines.
"""

def scrape_upwork_jobs():
    """
    Scrapes job listings from UpWork using undetected-chromedriver to bypass bot detection.
    Stores title, description, category, budget, skills, feasibility, and match_score.
    """
    options = uc.ChromeOptions()
    options.headless = False  # Make visible for debugging; change to True in production
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-gpu')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-blink-features=AutomationControlled')
    
    # driver = uc.Chrome(options=options)
    driver = uc.Chrome(options=options, use_subprocess=True)


    url = 'https://www.upwork.com/nx/jobs/search/?q=python&sort=recency'
    driver.get(url)
    time.sleep(10)

    try:
        WebDriverWait(driver, 30).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'article[data-test="JobTile"]'))
        )
    except Exception as e:
        print("❌ Job elements not loaded: Message:", e)
        driver.quit()
        return

    job_elements = driver.find_elements(By.CSS_SELECTOR, 'article[data-test="JobTile"]')
    print(f"🔍 Found {len(job_elements)} jobs")

    for job in job_elements:
        try:
            # title_elem = job.find_element(By.CSS_SELECTOR, 'h2.job-tile-title a')
            # title_elem = job.find_element(By.CSS_SELECTOR, 'a[data-test="job-tile-title-link"]')
            title_elem = job.find_element(By.CSS_SELECTOR, 'a[data-test*="job-tile-title-link"]')

            title = title_elem.text.strip()

            href = title_elem.get_attribute('href')
            full_url = f"https://www.upwork.com{href}" if href.startswith("/") else href

            try:
                desc_elem = job.find_element(By.CSS_SELECTOR, 'div[data-test="UpCLineClamp JobDescription"] p')
                description = desc_elem.text.strip()
                job_text = title + " " + description
                match_score = calculate_match_score(job_text, RESUME_TEXT)

            except:
                description = "No description available"

            # Extract category manually or default
            category = "General"

            # Extract budget if available
            try:
                # budget_elem = job.find_element(By.CSS_SELECTOR, 'ul[data-test="JobInfo"] li[data-test="job-type-label"]')
                budget_elem = job.find_element(By.CSS_SELECTOR, 'ul.job-tile-info-list li strong')

                budget = budget_elem.text.strip()
            except:
                budget = "Not listed"

            # Extract skills from token buttons
            # skill_tokens = job.find_elements(By.CSS_SELECTOR, 'div[data-test="TokenClamp JobAttrs"] button span')
            skill_tokens = job.find_elements(By.CSS_SELECTOR, 'button[data-test="token"] span')

            skills = ', '.join([token.text.strip() for token in skill_tokens if token.text.strip()])

            # Run feasibility engine
            is_feasible, match_score = evaluate_feasibility(title, description, skills, budget)

            exists = Job.query.filter_by(title=title).first()
            if not exists:
                new_job = Job(
                    title=title,
                    description=description,
                    category=category,
                    # budget=budget,
                    # skills=skills,
                    is_feasible=is_feasible,
                    match_score=match_score
                )
                db.session.add(new_job)
                print(f"✅ Added: {title[:50]} | Feasible: {is_feasible} | Score: {match_score}%")

        except Exception as e:
            print(f"❌ Error parsing job: {e}")

    db.session.commit()
    driver.quit()
    print("✅ Scraping completed and jobs saved.")
