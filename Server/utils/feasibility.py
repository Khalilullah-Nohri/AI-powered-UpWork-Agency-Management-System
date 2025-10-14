def evaluate_feasibility(title, description, skills, budget):
    title = title.lower()
    description = description.lower()
    skills = skills.lower()

    must_have = ['python', 'api', 'automation', 'scripting']
    banned = ['entry-level', 'java', 'unpaid']

    score = 0
    if any(term in title or term in description for term in must_have):
        score += 40
    if any(skill in skills for skill in must_have):
        score += 30
    if "budget" in budget.lower() and "$" in budget:
        score += 20
    if any(bad in title or bad in description for bad in banned):
        score -= 40

    score = max(0, min(100, score))
    is_feasible = score >= 60
    return is_feasible, score
