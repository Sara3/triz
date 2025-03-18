"""
TRIZ Analysis Service - Provides mock data and TRIZ analysis functions.
"""

import os
import json
import uuid
import datetime
import random
import shutil
from pathlib import Path
from typing import Dict, List, Any, Optional, Union
from .triz_constants import TRIZ_PRINCIPLES, ENGINEERING_PARAMETERS, CONTRADICTION_MATRIX

# Define directories for data
PATENT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "patents")
ANALYSES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "analyses")
TRIZ_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "triz")

# Create directories if they don't exist
os.makedirs(PATENT_DIR, exist_ok=True)
os.makedirs(ANALYSES_DIR, exist_ok=True)
os.makedirs(TRIZ_DATA_DIR, exist_ok=True)

# Import mock data
from data.mock_data import (
    TRIZ_PRINCIPLES, 
    ENGINEERING_PARAMETERS, 
    TRIZ_MATRIX, 
    PATENTS, 
    PATENT_ANALYSES, 
    PATENT_CITATIONS,
    serialize_datetime
)

def get_triz_principles() -> Dict[str, Dict[str, Any]]:
    """
    Get all TRIZ principles.
    
    Returns:
        Dictionary of TRIZ principles with principle ID as key.
    """
    return TRIZ_PRINCIPLES

def get_engineering_parameters() -> Dict[str, str]:
    """
    Get all engineering parameters.
    
    Returns:
        Dictionary of engineering parameters with parameter ID as key.
    """
    return ENGINEERING_PARAMETERS

def get_triz_matrix() -> Dict[str, Dict[str, List[str]]]:
    """
    Get the TRIZ contradiction matrix.
    
    Returns:
        Dictionary representation of the TRIZ matrix.
    """
    return TRIZ_MATRIX

def get_all_patents(search_term: str = '', status_filter: List[str] = None, sort_order: str = 'newest') -> List[Dict[str, Any]]:
    """
    Get all patents, with optional filtering and sorting.
    
    Args:
        search_term: Optional term to filter patents by title or content
        status_filter: Optional list of status values to filter by
        sort_order: Sort order ('newest', 'oldest', 'relevance')
    
    Returns:
        List of patent dictionaries
    """
    # Create a deep copy of the patents to avoid modifying the original data
    patents = [patent.copy() for patent in PATENTS]
    
    # Apply search filter if provided
    if search_term:
        search_term = search_term.lower()
        patents = [
            patent for patent in patents
            if search_term in patent['title'].lower() or
               search_term in patent.get('abstract', '').lower() or
               search_term in patent.get('inventor', '').lower() or
               search_term in patent.get('assignee', '').lower()
        ]
    
    # Apply status filter if provided
    if status_filter:
        patents = [patent for patent in patents if patent.get('status') in status_filter]
    
    # Sort patents
    if sort_order == 'newest':
        patents.sort(key=lambda p: p['upload_date'], reverse=True)
    elif sort_order == 'oldest':
        patents.sort(key=lambda p: p['upload_date'])
    
    # Convert datetime objects to strings for JSON serialization
    for patent in patents:
        if 'filing_date' in patent and patent['filing_date']:
            patent['filing_date'] = serialize_datetime(patent['filing_date'])
        if 'upload_date' in patent and patent['upload_date']:
            patent['upload_date'] = serialize_datetime(patent['upload_date'])
    
    return patents

def get_patent_by_id(patent_id: str) -> Optional[Dict[str, Any]]:
    """
    Get a patent by its ID.
    
    Args:
        patent_id: The patent ID
    
    Returns:
        Patent dictionary or None if not found
    """
    for patent in PATENTS:
        if patent['id'] == patent_id:
            result = patent.copy()
            
            # Convert datetime objects to strings for JSON serialization
            if 'filing_date' in result and result['filing_date']:
                result['filing_date'] = serialize_datetime(result['filing_date'])
            if 'upload_date' in result and result['upload_date']:
                result['upload_date'] = serialize_datetime(result['upload_date'])
            
            return result
    
    return None

def get_patent_citations(patent_id: str) -> List[Dict[str, Any]]:
    """
    Get citations for a specific patent.
    
    Args:
        patent_id: The patent ID
    
    Returns:
        List of citation dictionaries
    """
    citations = [citation.copy() for citation in PATENT_CITATIONS if citation['patent_id'] == patent_id]
    
    # Convert datetime objects to strings for JSON serialization
    for citation in citations:
        if 'citation_date' in citation and citation['citation_date']:
            citation['citation_date'] = serialize_datetime(citation['citation_date'])
    
    return citations

def get_analyses_for_patent(patent_id: str) -> List[Dict[str, Any]]:
    """
    Get all analyses for a specific patent.
    
    Args:
        patent_id: The patent ID
    
    Returns:
        List of analysis dictionaries
    """
    analyses = [analysis.copy() for analysis in PATENT_ANALYSES if analysis['patent_id'] == patent_id]
    
    # Convert datetime objects to strings for JSON serialization
    for analysis in analyses:
        if 'analysis_date' in analysis and analysis['analysis_date']:
            analysis['analysis_date'] = serialize_datetime(analysis['analysis_date'])
        if 'feedback_date' in analysis and analysis['feedback_date']:
            analysis['feedback_date'] = serialize_datetime(analysis['feedback_date'])
    
    return analyses

def get_all_analyses() -> List[Dict[str, Any]]:
    """
    Get all patent analyses.
    
    Returns:
        List of analysis dictionaries
    """
    analyses = [analysis.copy() for analysis in PATENT_ANALYSES]
    
    # Convert datetime objects to strings for JSON serialization
    for analysis in analyses:
        if 'analysis_date' in analysis and analysis['analysis_date']:
            analysis['analysis_date'] = serialize_datetime(analysis['analysis_date'])
        if 'feedback_date' in analysis and analysis['feedback_date']:
            analysis['feedback_date'] = serialize_datetime(analysis['feedback_date'])
        
        # Parse the JSON strings to dictionaries
        if 'extracted_data' in analysis and analysis['extracted_data']:
            analysis['extracted_data'] = json.loads(analysis['extracted_data'])
        if 'user_feedback' in analysis and analysis['user_feedback']:
            analysis['user_feedback'] = json.loads(analysis['user_feedback'])
    
    return analyses

def get_analysis_by_id(analysis_id: str) -> Optional[Dict[str, Any]]:
    """
    Get an analysis by its ID.
    
    Args:
        analysis_id: The analysis ID
    
    Returns:
        Analysis dictionary or None if not found
    """
    for analysis in PATENT_ANALYSES:
        if analysis['id'] == analysis_id:
            result = analysis.copy()
            
            # Convert datetime objects to strings for JSON serialization
            if 'analysis_date' in result and result['analysis_date']:
                result['analysis_date'] = serialize_datetime(result['analysis_date'])
            if 'feedback_date' in result and result['feedback_date']:
                result['feedback_date'] = serialize_datetime(result['feedback_date'])
            
            # Parse the JSON strings to dictionaries
            if 'extracted_data' in result and result['extracted_data']:
                result['extracted_data'] = json.loads(result['extracted_data'])
            if 'user_feedback' in result and result['user_feedback']:
                result['user_feedback'] = json.loads(result['user_feedback'])
            
            return result
    
    return None

def analyze_patent(patent_filename: str) -> Dict[str, Any]:
    """
    Analyze a patent using TRIZ methodology using LLM.
    
    Args:
        patent_filename: The filename of the patent to analyze
    
    Returns:
        Analysis result dictionary
    """
    # Find the patent by filename
    patent = None
    for p in PATENTS:
        if p['filename'] == patent_filename:
            patent = p
            break
    
    if not patent:
        raise ValueError(f"Patent with filename {patent_filename} not found")
    
    # Initialize the LLM
    from langchain_community.chat_models import ChatOpenAI
    from automated_analysis.triz_extraction import analyze_patent_text
    
    try:
        llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)
        
        # Get the patent text for analysis
        patent_text = patent.get('raw_text', '')
        if not patent_text:
            raise ValueError("Patent text not found")
        
        # Analyze the patent using LLM
        llm_response = analyze_patent_text(patent_text, llm)
        
        try:
            triz_analysis = json.loads(llm_response)
        except json.JSONDecodeError:
            raise ValueError("Failed to parse LLM response")
        
        # Create a new analysis record
        analysis_id = f"ANA{patent['id'][3:]}"
        
        new_analysis = {
            "id": analysis_id,
            "patent_id": patent['id'],
            "analysis_date": serialize_datetime(datetime.datetime.now()),
            "extracted_data": {
                "triz_contradictions": triz_analysis
            },
            "feedback_date": None,
            "user_feedback": None,
            "status": "new"
        }
        
        # Store the analysis
        store_analysis(new_analysis)
        
        return new_analysis
        
    except Exception as e:
        raise ValueError(f"Error during patent analysis: {str(e)}")

def update_analysis(analysis_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Update an existing analysis.
    
    Args:
        analysis_id: The analysis ID
        updates: Dictionary of fields to update
    
    Returns:
        Updated analysis dictionary or None if not found
    """
    # In a real implementation, this would update the database
    # For now, we'll just pretend to update and return the mock data
    
    analysis = get_analysis_by_id(analysis_id)
    if not analysis:
        return None
    
    # Update the fields
    for key, value in updates.items():
        if key in analysis:
            analysis[key] = value
    
    # Set the feedback date if user_feedback is provided
    if 'user_feedback' in updates:
        analysis['feedback_date'] = serialize_datetime(datetime.datetime.now())
    
    return analysis

def delete_analysis(analysis_id: str) -> bool:
    """
    Delete an analysis.
    
    Args:
        analysis_id: The analysis ID
    
    Returns:
        Boolean indicating success
    """
    # In a real implementation, this would delete from the database
    # For now, we'll just pretend it was successful
    return True

def approve_analysis(analysis_id: str) -> Optional[Dict[str, Any]]:
    """
    Approve an analysis.
    
    Args:
        analysis_id: The analysis ID
    
    Returns:
        Updated analysis dictionary or None if not found
    """
    analysis = get_analysis_by_id(analysis_id)
    if not analysis:
        return None
    
    # Update the status
    analysis['status'] = 'approved'
    
    return analysis

def get_patent_file(patent_id: str) -> Optional[str]:
    """
    Get the file path for a patent.
    
    Args:
        patent_id: The patent ID
    
    Returns:
        Path to the patent file or None if not found
    """
    # In a real implementation, this would return the actual file path
    # For now, we'll just return a mock path
    patent = get_patent_by_id(patent_id)
    if not patent:
        return None
    
    return f"data/patents/{patent['filename']}"

def upload_patent(file_data: bytes, filename: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
    """
    Upload a new patent.
    
    Args:
        file_data: The patent file data
        filename: The filename
        metadata: Dictionary of patent metadata
    
    Returns:
        The new patent dictionary
    """
    # In a real implementation, this would save the file and create a database entry
    # For now, we'll just return a mock patent
    
    patent_id = metadata.get('id', f"PAT{len(PATENTS) + 1}")
    
    new_patent = {
        "id": patent_id,
        "patent_number": metadata.get('patent_number', f"US{patent_id[3:]}"),
        "filename": filename,
        "title": metadata.get('title', "Untitled Patent"),
        "filing_date": metadata.get('filing_date', serialize_datetime(datetime.datetime.now())),
        "upload_date": serialize_datetime(datetime.datetime.now()),
        "raw_text": "Sample patent text...",
        "abstract": metadata.get('abstract', ""),
        "inventor": metadata.get('inventor', ""),
        "assignee": metadata.get('assignee', ""),
        "is_prior_art": metadata.get('is_prior_art', False),
        "is_competitor": metadata.get('is_competitor', False),
        "status": "pending"
    }
    
    return new_patent

# Helper function to store analysis result
def store_analysis(analysis: dict) -> bool:
    """Store an analysis result"""
    try:
        # Save to a JSON file
        analysis_file = os.path.join(ANALYSES_DIR, f"{analysis['id']}.json")
        with open(analysis_file, 'w') as f:
            json.dump(analysis, f, indent=2)
        return True
    except Exception as e:
        print(f"Error storing analysis: {str(e)}")
        return False 