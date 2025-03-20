"""
Mock data for the Patent Analytics Hub.
This acts as a substitute for a database, providing static data for the application.
"""

import datetime
import json
from typing import Dict, List, Any, Optional, Union

# TRIZ Principles
TRIZ_PRINCIPLES = {
    "1": {
        "name": "Segmentation",
        "description": "Divide an object into independent parts; make an object easy to disassemble; increase the degree of fragmentation or segmentation.",
        "examples": [
            "Replace a large truck with a truck and trailer",
            "Use a work breakdown structure for a large project",
            "Sectional furniture, modular electronics",
        ],
    },
    "2": {
        "name": "Taking out/Extraction",
        "description": "Extract or separate a disturbing part or property from an object, or extract only the necessary part or property.",
        "examples": [
            "Locate a noisy compressor outside the building where compressed air is used",
            "Use fiber optics to extract light from a source for remote viewing",
            "Extract essential oils from plants for perfumes",
        ],
    },
    "3": {
        "name": "Local quality",
        "description": "Change the structure of an object or external environment from uniform to non-uniform; make each part of an object function in different, useful ways.",
        "examples": [
            "Pencil erasers, multi-function tools",
            "Garden hose with adjustable nozzle for different sprays",
            "Use a temperature gradient instead of a constant temperature",
        ],
    },
    "4": {
        "name": "Asymmetry",
        "description": "Replace a symmetrical form with an asymmetrical form; if an object is already asymmetrical, increase the degree of asymmetry.",
        "examples": [
            "Asymmetrical mixing vessels or asymmetrical vanes in symmetrical vessels",
            "Ergonomic handles designed to match the hand",
            "Asymmetrical car tires for better traction",
        ],
    },
    "5": {
        "name": "Merging/Consolidation",
        "description": "Bring closer together or merge identical or similar objects, assemble identical or similar parts to perform parallel operations.",
        "examples": [
            "Personal computers in a network",
            "Thousands of microprocessors in a parallel processor computer",
            "Vanes in a ventilation system",
        ],
    },
}

# Engineering Parameters
ENGINEERING_PARAMETERS = {
    "1": "Weight of moving object",
    "2": "Weight of stationary object",
    "3": "Length of moving object",
    "4": "Length of stationary object",
    "5": "Area of moving object",
    "6": "Area of stationary object",
    "7": "Volume of moving object",
    "8": "Volume of stationary object",
    "9": "Speed",
    "10": "Force",
    "11": "Stress or pressure",
    "12": "Shape",
    "13": "Stability of the object's composition",
    "14": "Strength",
    "15": "Duration of action of moving object",
}

# TRIZ Contradiction Matrix (simplified)
TRIZ_MATRIX = {
    "1": {  # Improving parameter 1 (Weight of moving object)
        "2": ["8", "10", "36", "37"],  # Worsening parameter 2
        "3": ["15", "29", "34"],  # Worsening parameter 3
        "4": ["28", "35"],  # Worsening parameter 4
    },
    "2": {  # Improving parameter 2 (Weight of stationary object)
        "1": ["10", "1", "29", "35"],  # Worsening parameter 1
        "3": ["35", "3", "24", "37"],  # Worsening parameter 3
        "5": ["10", "28", "24", "35"],  # Worsening parameter 5
    },
    "3": {  # Improving parameter 3 (Length of moving object)
        "1": ["8", "15", "29", "34"],  # Worsening parameter 1
        "2": ["15", "17", "4"],  # Worsening parameter 2
        "9": ["17", "15", "13", "16"],  # Worsening parameter 9
    },
}

# Patents Mock Data
PATENTS = [
    {
        "id": "PAT123456",
        "patent_number": "US10123456B2",
        "filename": "medical_device_patent.pdf",
        "title": "Smart Medical Device for Patient Monitoring",
        "filing_date": datetime.datetime(2019, 5, 12),
        "upload_date": datetime.datetime(2023, 6, 15),
        "raw_text": """
        Abstract: A smart medical device for monitoring patient vital signs with improved accuracy and reduced power consumption.
        
        Background: Patient monitoring devices require continuous operation for extended periods, leading to high power consumption and reduced battery life. Current solutions often sacrifice monitoring accuracy for power efficiency.
        
        Summary of Invention: The invention provides a smart medical device that implements dynamic power management based on patient condition, allowing for continuous monitoring with significantly reduced power consumption. This is achieved through a combination of specialized sensors and adaptive sampling rates.
        
        Detailed Description: The device comprises a sensor array, a microcontroller, and a wireless communication module. The sensor array includes temperature, pulse, and blood oxygen sensors. The microcontroller implements an algorithm that adjusts sampling frequency based on detected patient condition...
        """,
        "is_prior_art": False,
        "is_competitor": True,
        "abstract": "A smart medical device for monitoring patient vital signs with improved accuracy and reduced power consumption.",
        "inventor": "John Smith, Jane Doe",
        "assignee": "MedTech Innovations, Inc.",
        "status": "analyzed",
    },
    {
        "id": "PAT234567",
        "patent_number": "US10234567B2",
        "filename": "surgical_tool_patent.pdf",
        "title": "Minimally Invasive Surgical Tool with Enhanced Dexterity",
        "filing_date": datetime.datetime(2020, 2, 28),
        "upload_date": datetime.datetime(2023, 7, 10),
        "raw_text": """
        Abstract: A surgical tool designed for minimally invasive procedures with enhanced dexterity and precision while maintaining a compact form factor.
        
        Background: Traditional minimally invasive surgical tools often sacrifice dexterity for size, limiting the range and precision of movements. This constraint makes certain procedures more difficult and potentially increases patient risk.
        
        Summary of Invention: The invention provides a surgical tool with a novel joint mechanism that provides increased degrees of freedom in a compact design. The tool uses a segmented approach with microactuators to enable complex movements within a small diameter.
        
        Detailed Description: The surgical tool comprises a handle assembly, a shaft, and an end effector. The shaft includes multiple articulating segments, each controlled by microactuators. The control system uses a combination of direct mechanical linkages and electronic controls...
        """,
        "is_prior_art": True,
        "is_competitor": False,
        "abstract": "A surgical tool designed for minimally invasive procedures with enhanced dexterity and precision while maintaining a compact form factor.",
        "inventor": "Robert Johnson, Sarah Williams",
        "assignee": "Surgical Precision, LLC",
        "status": "reviewed",
    },
    {
        "id": "PAT345678",
        "patent_number": "US10345678B2",
        "filename": "diagnostic_imaging_patent.pdf",
        "title": "Advanced Diagnostic Imaging System with Reduced Radiation Exposure",
        "filing_date": datetime.datetime(2021, 9, 15),
        "upload_date": datetime.datetime(2023, 8, 5),
        "raw_text": """
        Abstract: An advanced diagnostic imaging system that provides high-resolution images while significantly reducing patient radiation exposure.
        
        Background: Conventional imaging systems, particularly those using X-rays, expose patients to ionizing radiation. While efforts have been made to reduce exposure, there often remains a trade-off between image quality and radiation dose.
        
        Summary of Invention: This invention provides an imaging system that uses a novel detector array and advanced image processing algorithms to reduce the required radiation dose while maintaining or improving image quality.
        
        Detailed Description: The system includes a radiation source, a specialized detector array, and an image processing unit. The detector array incorporates high-sensitivity elements arranged in a non-uniform pattern. The image processing unit applies machine learning algorithms to enhance image clarity...
        """,
        "is_prior_art": False,
        "is_competitor": False,
        "abstract": "An advanced diagnostic imaging system that provides high-resolution images while significantly reducing patient radiation exposure.",
        "inventor": "Maria Garcia, David Chen",
        "assignee": "Imaging Solutions, Inc.",
        "status": "pending",
    },
]

# Patent Analysis Mock Data
PATENT_ANALYSES = [
    {
        "id": "ANA123456",
        "patent_id": "PAT123456",
        "analysis_date": datetime.datetime(2023, 6, 20),
        "extracted_data": json.dumps(
            {
                "triz_contradictions": [
                    {
                        "improving": "9",  # Speed
                        "worsening": "10",  # Force/Energy
                        "principles": [
                            "15",
                            "35",
                            "2",
                        ],  # Dynamicity, Parameter change, Extraction
                    },
                    {
                        "improving": "14",  # Strength
                        "worsening": "1",  # Weight of moving object
                        "principles": [
                            "27",
                            "3",
                            "15",
                            "40",
                        ],  # Cheap disposable objects, Local quality, Dynamicity, Composite materials
                    },
                ],
                "key_problems": [
                    "Power consumption vs monitoring accuracy",
                    "Device size vs battery life",
                ],
                "innovative_solutions": [
                    "Dynamic sampling rate based on patient condition",
                    "Miniaturized sensor array with specialized power management",
                ],
            }
        ),
        "feedback_date": datetime.datetime(2023, 7, 1),
        "user_feedback": json.dumps(
            {
                "accuracy": 4.5,
                "completeness": 4.0,
                "suggestions": "Consider adding principles related to periodic action (19) for the power management aspect.",
            }
        ),
        "status": "approved",
    },
    {
        "id": "ANA234567",
        "patent_id": "PAT234567",
        "analysis_date": datetime.datetime(2023, 7, 15),
        "extracted_data": json.dumps(
            {
                "triz_contradictions": [
                    {
                        "improving": "12",  # Shape
                        "worsening": "7",  # Volume of moving object
                        "principles": [
                            "1",
                            "4",
                            "7",
                            "35",
                        ],  # Segmentation, Asymmetry, Nested dolls, Parameter change
                    }
                ],
                "key_problems": [
                    "Tool dexterity vs size constraints",
                    "Control precision vs mechanical complexity",
                ],
                "innovative_solutions": [
                    "Segmented shaft with microactuators",
                    "Novel joint mechanism for increased degrees of freedom",
                ],
            }
        ),
        "feedback_date": None,
        "user_feedback": None,
        "status": "pending",
    },
    {
        "id": "ANA345678",
        "patent_id": "PAT345678",
        "analysis_date": datetime.datetime(2023, 8, 10),
        "extracted_data": json.dumps(
            {
                "triz_contradictions": [
                    {
                        "improving": "27",  # Reliability
                        "worsening": "31",  # Harmful side effects
                        "principles": [
                            "22",
                            "21",
                            "27",
                            "39",
                        ],  # Convert harm to benefit, Skip, Cheap disposable, Inert atmosphere
                    }
                ],
                "key_problems": [
                    "Image quality vs radiation exposure",
                    "Detection sensitivity vs system cost",
                ],
                "innovative_solutions": [
                    "Non-uniform detector array pattern",
                    "Machine learning enhanced image processing",
                ],
            }
        ),
        "feedback_date": None,
        "user_feedback": None,
        "status": "new",
    },
]

# Patent Citations Mock Data
PATENT_CITATIONS = [
    {
        "id": 1,
        "patent_id": "PAT123456",
        "cited_patent_number": "US9876543B2",
        "citation_context": "Referenced for its power management techniques in wearable devices",
        "citation_date": datetime.datetime(2019, 4, 10),
    },
    {
        "id": 2,
        "patent_id": "PAT123456",
        "cited_patent_number": "US9765432B1",
        "citation_context": "Referenced for sensor array configuration",
        "citation_date": datetime.datetime(2019, 4, 10),
    },
    {
        "id": 3,
        "patent_id": "PAT234567",
        "cited_patent_number": "US9654321B2",
        "citation_context": "Referenced for articulating joint mechanisms",
        "citation_date": datetime.datetime(2020, 1, 15),
    },
    {
        "id": 4,
        "patent_id": "PAT345678",
        "cited_patent_number": "US9543210B2",
        "citation_context": "Referenced for detector array design",
        "citation_date": datetime.datetime(2021, 8, 5),
    },
]


# Helper function to serialize datetime objects
def serialize_datetime(obj):
    if isinstance(obj, datetime.datetime):
        return obj.isoformat()
    raise TypeError("Type not serializable")
