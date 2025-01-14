import json
import os
from PyPDF2 import PdfReader
import re
import spacy
import pandas as pd
from flask import Flask, request

# File path for the resume
resume_path = '../data/resume/resume.pdf'

# Load spaCy model
nlp = spacy.load('en_core_web_sm')

# Predefined skills list
skills_list = pd.read_json('skills.json')['skills']

def extract_text_from_pdf(file_path):
    """Extract text from a PDF file."""
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def clean_text(text):
    return re.sub(r'\s+', ' ', text).strip()

def extract_entities(text):
    """
    Extract named entities using spaCy.
    Returns skills, projects, and degrees (with universities) found in the text.
    """
    doc = nlp(text)
    skills = []
    projects = []
    degrees = []

    for ent in doc.ents:
        if ent.label_ == 'ORG':
            # Classify universities under degrees and others under projects
            if "university" in ent.text.lower() or "college" in ent.text.lower():
                degrees.append(ent.text)
            else:
                projects.append(ent.text)
        elif ent.label_ == 'EDUCATION':
            degrees.append(ent.text)
    
    # Filter noisy entries from projects
    projects = [
        proj for proj in projects if len(proj.split()) > 1 and not proj.lower().startswith("skills")
    ]

    # Deduplicate all fields
    return {
        'skills': list(set(skills)),
        'projects': list(set(projects)),
        'degrees': list(set(degrees)),
    }

def extract_skills(text):
    """Extract predefined skills from the text."""
    found_skills = [skill for skill in skills_list if skill.lower() in text.lower()]
    return list(set(found_skills))

def parse_resume():
    # Ensure the file exists
    file_path = 'uploaded.pdf'
    if not os.path.exists(file_path):
        return json.dumps({'error': f'File not found: {file_path}'})
        # Extract and process text
    text = extract_text_from_pdf(file_path)
    text = clean_text(text)
    # Extract entities and skills
    entities = extract_entities(text)
    predefined_skills = extract_skills(text)
    # Combine extracted and predefined skills
    combined_skills = list(set(entities['skills'] + predefined_skills))
    # Prepare result
    return json.dumps({
        'skills': combined_skills,
        'projects': entities['projects'],
        'degrees': [
            deg for deg in entities['degrees'] if "university" in deg.lower() or "college" in deg.lower() or "bachelor" in deg.lower() or "master" in deg.lower()
        ],  # Filter valid degrees
    }, indent=4)

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def initiate_parsing():

    with open('uploaded.pdf', 'wb') as f:
        f.write(request.data)  # Access binary data from the request
        result = json.loads(parse_resume())
        os.remove('uploaded.pdf')
    return result

if __name__ == "__main__":
    app.run(port='8080', debug=True)
    # Parse the resume and print the output
    # print(result)
    # result2 = json.loads(parse_resume(listing_path))
    # # print(result2)
    # overlap_count = 0
    # print('Overlapping skills: \n')
    # for skill in result['skills']:
    #     if skill in result2['skills']:
    #         overlap_count += 1
    #         print(skill, end=', ')
    # for skill in result['projects']:
    #     if skill in result2['projects']:
    #         print(skill, end=', ')
    
    # print(f"Percentage overlap: {overlap_count/(len(result2['skills'])):.2f}")