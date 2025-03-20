#!/usr/bin/env python3
import os
import json
import glob
import sys
from datetime import datetime, UTC
from dotenv import load_dotenv

# Add the current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

from langchain.prompts import PromptTemplate
from langchain_community.chat_models import ChatOpenAI
from utils.patent_extraction import create_llm_content, process_patent
from langchain.chat_models import init_chat_model

# Load environment variables
load_dotenv()

# Retrieve the API key
api_key = os.getenv("OPENAI_API_KEY")

# Define prompt template for TRIZ extraction
prompt_template = PromptTemplate(
    input_variables=["patent_text"],
    template="""
You are a seasoned expert in TRIZ analysis. Analyze the following patent text to identify contradictions where improving one parameter results in the deterioration of another, and then suggest appropriate TRIZ inventive principles for each contradiction. There may be multiple contradictions and each may have several suggested principles. Return the answer strictly in JSON format with the following schema:

[
  {
    "contradiction": {
         "improving_parameter": "text",
         "worsening_parameter": "text"
    },
    "suggested_principles": ["Principle1", "Principle2", ...]
  },
  ...
]

Patent text:
{patent_text}
""",
)


def escape_curly_braces(text):
    return text.replace("{", "{{").replace("}", "}}")


def analyze_patent_text(patent_text, llm):
    safe_text = escape_curly_braces(patent_text)
    prompt_str = prompt_template.template.replace("{patent_text}", safe_text)
    response = llm.invoke(prompt_str)
    return response.content


def load_patent_files(directory_path):
    texts = []
    file_paths = glob.glob(os.path.join(directory_path, "*.pdf"))
    for file_path in file_paths:
        targeted_text = create_llm_content(file_path)
        texts.append({"filename": os.path.basename(file_path), "text": targeted_text})
    return texts


def main():
    directory = "./patent_samples/"
    patents = load_patent_files(directory)
    # llm = init_chat_model("deepseek-r1-distill-llama-70b", model_provider="groq", temperature=0)
    llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)
    results = []
    for patent in patents:
        print(f"Analyzing {patent['filename']} ...")
        llm_response = analyze_patent_text(patent["text"], llm)
        try:
            analysis_json = json.loads(llm_response)
        except Exception as e:
            print(f"Error parsing LLM response for {patent['filename']}: {e}")
            analysis_json = {}
        result = {
            "filename": patent["filename"],
            "analysis_date": datetime.now(UTC).isoformat(),
            "triz_extraction": analysis_json,
        }
        results.append(result)
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
