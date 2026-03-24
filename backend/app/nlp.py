import spacy
import re
import numpy as np

# Load lightweight Spacy model for entity extraction
try:
    nlp = spacy.load("en_core_web_sm")
except:
    nlp = None

def extract_keywords(text: str) -> list:
    """Extract high-signal technical keywords from text."""
    if not nlp:
        return []
    
    doc = nlp(text)
    target_labels = ["ORG", "PRODUCT", "WORK_OF_ART", "GPE", "PERSON"]
    keywords = set()
    
    for ent in doc.ents:
        if ent.label_ in target_labels:
            val = ent.text.strip()
            if len(val) > 2 and not val.isdigit():
                keywords.add(val)
                
    for chunk in doc.noun_chunks:
        val = chunk.text.strip()
        if not re.search(r'\b(a|the|of|in|to|with)\b', val, re.I) and len(val) > 2:
            keywords.add(val)
            
    tech_terms = ["Python", "JavaScript", "React", "Node.js", "AWS", "Docker", "Kubernetes", "SQL", "NoSQL", "Git", "Agile", "Scrum", "CI/CD", "Machine Learning", "Data Analysis", "Project Management", "Stakeholder Management"]
    for term in tech_terms:
        if re.search(rf'\b{re.escape(term)}\b', text, re.I):
            keywords.add(term)
            
    return list(keywords)

def get_match_score(resume_text: str, jd_text: str) -> dict:
    """Calculate match score using lightweight logic + placeholders for AI alignment."""
    
    jd_keywords = extract_keywords(jd_text)
    resume_keywords = extract_keywords(resume_text)
    
    # 1. Hard Keyword Salience (50% weight)
    matched_keywords = []
    for kw in jd_keywords:
        if re.search(rf'\b{re.escape(kw)}\b', resume_text, re.I):
            matched_keywords.append(kw)
            
    keyword_score = (len(matched_keywords) / len(jd_keywords) * 100) if jd_keywords else 100
    
    # 2. Semantic Alignment (30% weight) 
    # For performance, we use a basic Jaccard similarity as a proxy for the initial scan
    # This will be refined by the actual AI re-optimization step
    words_resume = set(resume_text.lower().split())
    words_jd = set(jd_text.lower().split())
    intersection = words_resume.intersection(words_jd)
    semantic_score = (len(intersection) / len(words_jd) * 100) if words_jd else 100
    
    # 3. Structural Integrity (20% weight)
    sections = ["experience", "education", "skills", "contact", "summary"]
    section_count = sum(1 for sec in sections if re.search(rf'\b{sec}\b', resume_text, re.I))
    section_integrity = (section_count / len(sections) * 100)
    
    overall_score = (keyword_score * 0.5) + (semantic_score * 0.3) + (section_integrity * 0.2)
    
    missing = [kw for kw in jd_keywords if kw not in matched_keywords]
    
    return {
        "overall_score": round(overall_score, 1),
        "breakdown": {
            "keyword_match": round(keyword_score, 1),
            "semantic_alignment": round(semantic_score, 1),
            "section_integrity": round(section_integrity, 1)
        },
        "missing_keywords": missing[:15],
        "matched_keywords": matched_keywords
    }
