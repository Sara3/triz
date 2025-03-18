#!/usr/bin/env python3
import os
import re
from PyPDF2 import PdfReader
from datetime import datetime

def extract_text(file_path):
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text

def extract_patent_metadata(text):
    fields = {}
    # Patent Number
    m = re.search(r'(?:Patent No\.?\s*:?\s*US\s*[\d,]+(?:\s*[BA]\d*)?)', text, re.IGNORECASE)
    fields["patent_number"] = m.group(0).replace("Patent No", "").strip() if m else ""
    
    # Title
    m = re.search(r'\(\s*54\s*\)\s*(.+)', text)
    fields["title"] = m.group(1).strip() if m else ""
    
    # Filing Date
    m = re.search(r'(?:Filed|Date Filed)[:\s]+(\d{4}[-/]\d{2}[-/]\d{2})', text)
    fields["filing_date"] = m.group(1).replace("/", "-") if m else ""
    
    # Abstract
    m = re.search(r'(?:Abstract\s*\n)(.+?)(?:\n(?:Background|SUMMARY|Claims))', text, re.DOTALL | re.IGNORECASE)
    fields["abstract"] = m.group(1).strip() if m else ""
    
    # Inventors
    m = re.search(r'(?:Inventor(?:s)? Information\s*\n)(.+?)(?=Assignee)', text, re.DOTALL | re.IGNORECASE)
    if m:
        inventors = re.findall(r'([A-Z][a-zA-Z]+;\s*[A-Za-z]+)', m.group(1))
        fields["inventor"] = ", ".join(inventors) if inventors else m.group(1).strip()
    else:
        fields["inventor"] = ""
    
    # Assignee
    m = re.search(r'(?:Assignee Information\s*\n(?:NAME)?\s*)(.+?)(?=\n)', text, re.DOTALL | re.IGNORECASE)
    fields["assignee"] = m.group(1).strip() if m else ""
    
    # CPC Keywords
    cpc = re.findall(r'CPCI?\s+[A-Z]\s+\d+\s+[A-Z]\s+\d+/\d+', text)
    fields["keywords"] = ", ".join(cpc) if cpc else ""
    
    # Raw Text
    fields["raw_text"] = text
    
    # Additional metadata
    fields["filename"] = ""
    fields["upload_date"] = datetime.utcnow().isoformat()
    fields["is_prior_art"] = False
    fields["is_competitor"] = False
    
    return fields

def extract_target_sections_for_llm(text):
    """Extract the most important sections of the patent for TRIZ analysis."""
    sections = []
    max_chars_per_section = 3000  # Limit each section to avoid token overflow
    
    # Extract Abstract (always include)
    m = re.search(r'(?:Abstract\s*\n)(.+?)(?=\n(?:Background|SUMMARY|Claims))', text, re.DOTALL | re.IGNORECASE)
    if m:
        abstract = m.group(1).strip()
        sections.append("ABSTRACT:\n" + abstract[:max_chars_per_section])
    
    # Extract Summary/Summary of Invention (high priority)
    m = re.search(r'(?:Summary(?: of the Invention)?\s*\n)(.+?)(?=\n(?:Claims|Detailed Description|Conclusion))',
                  text, re.DOTALL | re.IGNORECASE)
    if m:
        summary = m.group(1).strip()
        sections.append("SUMMARY:\n" + summary[:max_chars_per_section])
    
    # Extract Background (focus on problem statement)
    m = re.search(r'(?:Background(?: of the Invention)?\s*\n)(.+?)(?=\n(?:Summary|Detailed Description))',
                  text, re.DOTALL | re.IGNORECASE)
    if m:
        background = m.group(1).strip()
        # Try to find the problem statement part
        problem_match = re.search(r'(?:problem|challenge|limitation|drawback|issue).+?(?=\n|$)', 
                                background, re.DOTALL | re.IGNORECASE)
        if problem_match:
            sections.append("PROBLEM STATEMENT:\n" + problem_match.group(0)[:max_chars_per_section])
        else:
            sections.append("BACKGROUND:\n" + background[:max_chars_per_section])
    
    # Extract first part of Detailed Description (most relevant implementation)
    m = re.search(r'(?:Detailed Description(?: of the Invention)?\s*\n)(.+?)(?=\n(?:Claims|Conclusion))',
                  text, re.DOTALL | re.IGNORECASE)
    if m:
        detailed_desc = m.group(1).strip()
        # Take only the first paragraph which usually contains the key implementation
        paragraphs = detailed_desc.split('\n\n')
        if paragraphs:
            sections.append("KEY IMPLEMENTATION:\n" + paragraphs[0][:max_chars_per_section])
    
    # If no sections were found, return a truncated version of the text
    if not sections:
        return text[:4000].strip()
    
    # Join sections with clear separation and ensure total length is reasonable
    result = "\n\n".join(sections)
    return result[:8000].strip()  # Ensure total length is well within token limits

def process_patent(path):
    if not os.path.exists(path):
        print(f"File {path} does not exist")
        return None
    
    text = extract_text(path)
    metadata = extract_patent_metadata(text)
    metadata["filename"] = os.path.basename(path)
    return metadata

def create_llm_content(path):
    if not os.path.exists(path):
        print(f"File {path} does not exist")
        return ""
    
    text = extract_text(path)
    targeted_content = extract_target_sections_for_llm(text)
    return targeted_content
