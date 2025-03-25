#!/usr/bin/env python3
import os
import json
import glob
import sys
import argparse
import pandas as pd
from datetime import datetime, UTC
from dotenv import load_dotenv

# Add the current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

# Import patent extraction functions
from backend.automated_analysis.patent_extraction import process_patent, extract_text, extract_target_sections_for_llm
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

# Load environment variables
load_dotenv()

# Retrieve the API key
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("Warning: OPENAI_API_KEY environment variable not found.")
    print("Please set your OpenAI API key using:")
    print("  - On Windows: $env:OPENAI_API_KEY = 'your-api-key'")
    print("  - On Linux/Mac: export OPENAI_API_KEY='your-api-key'")
    api_key = "dummy_key"  # This will cause an error when trying to use the API

# Define prompt template for patent analysis
prompt_template = PromptTemplate(
    input_variables=["patent_text"],
    template="""
You are a patent analysis expert with TRIZ methodology expertise. Analyze the following patent text to extract key information, including contradictions and inventive principles.
Return your analysis strictly in JSON format with the following schema:

{
  "summary": "Brief summary of the patent",
  "invention_purpose": "Main purpose of the invention",
  "key_innovations": ["innovation1", "innovation2", ...],
  "technical_fields": ["field1", "field2", ...],
  "potential_applications": ["application1", "application2", ...],
  "relevance_score": Integer from 1-10 indicating commercial relevance,
  "contradictions": [
    {
      "improving_parameter": "text",
      "worsening_parameter": "text"
    },
    ...
  ],
  "suggested_principles": ["Principle1", "Principle2", ...]
}

Patent text:
{patent_text}
""",
)

def escape_curly_braces(text):
    return text.replace("{", "{{").replace("}", "}}")

def analyze_patent_with_llm(patent_text, llm):
    """Send patent text to LLM and get analysis in JSON format"""
    try:
        safe_text = escape_curly_braces(patent_text)
        prompt_str = prompt_template.template.replace("{patent_text}", safe_text)
        response = llm.invoke(prompt_str)
        return response.content
    except Exception as e:
        print(f"Error during LLM analysis: {e}")
        return json.dumps({
            "summary": "Error during analysis",
            "invention_purpose": "",
            "key_innovations": [],
            "technical_fields": [],
            "potential_applications": [],
            "relevance_score": 0,
            "contradictions": [],
            "suggested_principles": []
        })

def process_patents_in_folder(folder_path, output_file):
    """Process all patent files in a folder and save results to Excel"""
    #llm = init_chat_model("deepseek-r1-distill-llama-70b", model_provider="groq", temperature=0) 
    llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0, openai_api_key=api_key)
    
    # Find all PDF files (assuming patents are in PDF format)
    patent_files = glob.glob(os.path.join(folder_path, "*.pdf"))
    
    results = []
    
    # Process each patent file
    for patent_path in patent_files:
        file_name = os.path.basename(patent_path)
        print(f"Processing patent: {file_name}...")
        
        # Extract patent metadata
        metadata = process_patent(patent_path)
        if not metadata:
            print(f"Skipping {file_name} - could not extract metadata")
            continue
        
        # Extract text for LLM analysis
        full_text = extract_text(patent_path)
        targeted_text = extract_target_sections_for_llm(full_text)
        
        # Analyze with LLM
        try:
            llm_response = analyze_patent_with_llm(targeted_text, llm)
            analysis_json = json.loads(llm_response)
            # Print the JSON response to the terminal
            print(f"\nJSON Analysis for {file_name}:")
            print(json.dumps(analysis_json, indent=2))
            print("\n" + "-"*50 + "\n")
        except Exception as e:
            print(f"Error analyzing {file_name}: {e}")
            analysis_json = {
                "summary": "Error in analysis",
                "invention_purpose": "",
                "key_innovations": [],
                "technical_fields": [],
                "potential_applications": [],
                "relevance_score": 0,
                "contradictions": [],
                "suggested_principles": []
            }
        
        # Process contradictions for display
        contradictions_text = ""
        if analysis_json.get("contradictions"):
            contradiction_items = []
            for contradiction in analysis_json.get("contradictions", []):
                imp = contradiction.get("improving_parameter", "")
                wor = contradiction.get("worsening_parameter", "")
                if imp and wor:
                    contradiction_items.append(f"{imp} vs {wor}")
            contradictions_text = ", ".join(contradiction_items)
        
        # Combine metadata and analysis
        result = {
            "filename": file_name,
            "patent_number": metadata.get("patent_number", ""),
            "title": metadata.get("title", ""),
            "filing_date": metadata.get("filing_date", ""),
            "inventors": metadata.get("inventor", ""),
            "assignee": metadata.get("assignee", ""),
            "summary": analysis_json.get("summary", ""),
            "invention_purpose": analysis_json.get("invention_purpose", ""),
            "key_innovations": ", ".join(analysis_json.get("key_innovations", [])),
            "technical_fields": ", ".join(analysis_json.get("technical_fields", [])),
            "potential_applications": ", ".join(analysis_json.get("potential_applications", [])),
            "contradictions": contradictions_text,
            "suggested_principles": ", ".join(analysis_json.get("suggested_principles", [])),
            "relevance_score": analysis_json.get("relevance_score", 0),
            "analysis_date": datetime.now(UTC).isoformat()
        }
        results.append(result)
    
    # Convert to DataFrame and save to Excel
    if results:
        df = pd.DataFrame(results)
        df.to_excel(output_file, index=False)
        print(f"Patent analysis complete! Results saved to {output_file}")
    else:
        print("No patents were analyzed.")

def main():
    parser = argparse.ArgumentParser(description="Analyze patent files and save results to Excel")
    parser.add_argument("folder", help="Folder containing patent files to analyze")
    parser.add_argument("--output", "-o", default="patent_analysis_results.xlsx", help="Output Excel file path")
    args = parser.parse_args()
    
    # Validate folder exists
    if not os.path.isdir(args.folder):
        print(f"Error: Folder '{args.folder}' does not exist or is not a directory")
        return
    
    # Run patent analysis
    process_patents_in_folder(args.folder, args.output)

if __name__ == "__main__":
    main() 