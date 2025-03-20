"""
Contains constants for TRIZ methodology including the 40 inventive principles
and the 39x39 contradiction matrix.
"""

# The 40 Inventive Principles of TRIZ
TRIZ_PRINCIPLES = {
    1: {
        "name": "Segmentation",
        "description": "Divide an object into independent parts",
        "examples": [
            "Sectional furniture",
            "Modular computer components",
            "Sectional sofa",
        ],
    },
    2: {
        "name": "Taking out",
        "description": "Extract the disturbing part or property from an object",
        "examples": [
            "Noise absorption in a quiet room",
            "Use of a sound-absorbing ceiling",
            "Removing seeds from fruits",
        ],
    },
    3: {
        "name": "Local quality",
        "description": "Change an object's structure or environment from uniform to non-uniform",
        "examples": [
            "Gradient temperature tools",
            "Composite materials",
            "Pencil with eraser",
        ],
    },
    4: {
        "name": "Asymmetry",
        "description": "Change the shape from symmetrical to asymmetrical",
        "examples": [
            "Asymmetric mixing vessels",
            "Ergonomic handles",
            "Asymmetric tire tread for better traction",
        ],
    },
    5: {
        "name": "Merging",
        "description": "Bring closer together identical or similar objects",
        "examples": [
            "Personal computer with multiple functions",
            "Multi-function printer/scanner/copier",
            "Swiss Army knife",
        ],
    },
    6: {
        "name": "Universality",
        "description": "Make a part or object perform multiple functions",
        "examples": [
            "Sofa that converts to a bed",
            "Child's car safety seat that converts to a stroller",
            "Multifunction power tools",
        ],
    },
    7: {
        "name": "Nested doll",
        "description": "Place one object inside another",
        "examples": [
            "Telescoping antenna",
            "Retractable pen",
            "Nesting tables or measuring cups",
        ],
    },
    8: {
        "name": "Anti-weight",
        "description": "Compensate for the weight of an object by merging with other objects that provide lift",
        "examples": [
            "Hydrofoil",
            "Aircraft wing design",
            "Helium balloons to support structures",
        ],
    },
    9: {
        "name": "Preliminary anti-action",
        "description": "If an action has both harmful and useful effects, precede it with anti-actions to reduce harm",
        "examples": [
            "Buffer solution to prevent rapid pH change",
            "Pre-stressing concrete",
            "Preheating metal before deformation",
        ],
    },
    10: {
        "name": "Preliminary action",
        "description": "Perform a required change to an object completely or partially before it is needed",
        "examples": [
            "Pre-pasted wallpaper",
            "Preheated oven",
            "Prefabricated housing components",
        ],
    },
    11: {
        "name": "Beforehand cushioning",
        "description": "Prepare emergency means beforehand to compensate for the relatively low reliability of an object",
        "examples": ["Backup parachute", "Reserve tank", "Emergency generator"],
    },
    12: {
        "name": "Equipotentiality",
        "description": "Change the condition of the work in such a way that an object need not be raised or lowered",
        "examples": ["Locks in a canal", "Spring loading", "Self-leveling tables"],
    },
    13: {
        "name": "The other way round",
        "description": "Invert the action used to solve the problem",
        "examples": [
            "Rotating the part instead of the tool",
            "Turning a container upside-down to empty it",
            "Moving platform instead of moving person",
        ],
    },
    14: {
        "name": "Spheroidality – Curvature",
        "description": "Instead of using rectilinear parts, surfaces, or forms, use curvilinear ones",
        "examples": [
            "Dome structures for strength",
            "Aerodynamic vehicle shapes",
            "Curved handles for better grip",
        ],
    },
    15: {
        "name": "Dynamics",
        "description": "Make an object or its environment adjustable for optimal performance at each stage of operation",
        "examples": [
            "Adjustable steering wheel",
            "Flexible manufacturing system",
            "Variable focus lenses",
        ],
    },
    16: {
        "name": "Partial or excessive actions",
        "description": "If 100% of an objective is hard to achieve, use slightly less or slightly more to simplify the problem",
        "examples": [
            "Overspray when painting, then remove excess",
            "Fill and then remove excess",
            "Overscan in television",
        ],
    },
    17: {
        "name": "Another dimension",
        "description": "Move into an additional dimension, from 1D to 2D or from 2D to 3D",
        "examples": [
            "Multi-story parking or buildings",
            "3D integrated circuits",
            "Spiral conveyor",
        ],
    },
    18: {
        "name": "Mechanical vibration",
        "description": "Cause an object to oscillate or vibrate",
        "examples": [
            "Electric toothbrush",
            "Vibrating concrete to remove air bubbles",
            "Ultrasonic cleaning",
        ],
    },
    19: {
        "name": "Periodic action",
        "description": "Instead of continuous action, use periodic or pulsating actions",
        "examples": ["Pulsed welding", "Hammer drill", "Pulse jet engines"],
    },
    20: {
        "name": "Continuity of useful action",
        "description": "Make all parts of an object work at full load all the time",
        "examples": [
            "Flywheel to maintain energy during non-productive periods",
            "Continuous operation manufacturing",
            "Multi-cylinder engines for smooth operation",
        ],
    },
    21: {
        "name": "Skipping",
        "description": "Conduct a process or certain stages at high speed",
        "examples": [
            "Flash freezing of food",
            "High-speed cutting to avoid heat damage",
            "Rapid prototyping technologies",
        ],
    },
    22: {
        "name": "Blessing in disguise",
        "description": "Use harmful factors to achieve a positive effect",
        "examples": [
            "Friction used for braking",
            "Waste heat for heating a building",
            "Recycling harmful waste into useful products",
        ],
    },
    23: {
        "name": "Feedback",
        "description": "Introduce feedback to improve a process or action",
        "examples": [
            "Thermostat",
            "Automatic gain control",
            "Quality control statistical processes",
        ],
    },
    24: {
        "name": "Intermediary",
        "description": "Use an intermediary carrier article or intermediary process",
        "examples": [
            "Catalyst in chemical reactions",
            "Remote controls",
            "Package delivery service",
        ],
    },
    25: {
        "name": "Self-service",
        "description": "Make an object serve itself or organize it to perform auxiliary functions",
        "examples": [
            "Self-sharpening lawn mower blades",
            "Halogen lamp that cleans itself",
            "Self-healing materials",
        ],
    },
    26: {
        "name": "Copying",
        "description": "Instead of an object that is unavailable, expensive, or fragile, use simpler and inexpensive copies",
        "examples": [
            "Virtual reality",
            "Acoustic testing using holography",
            "Flight simulators",
        ],
    },
    27: {
        "name": "Cheap short-living objects",
        "description": "Replace an expensive object with multiple cheap ones, compromising certain qualities",
        "examples": [
            "Disposable paper cups",
            "Single-use cameras",
            "Breakaway components in crash safety",
        ],
    },
    28: {
        "name": "Mechanics substitution",
        "description": "Replace a mechanical means with a sensory means",
        "examples": [
            "Using optical, acoustic, or thermal measurement instead of mechanical measurement",
            "Electronic nose to detect chemicals",
            "Electric fields to detect changes",
        ],
    },
    29: {
        "name": "Pneumatics and hydraulics",
        "description": "Use gas and liquid parts of an object instead of solid parts",
        "examples": [
            "Hydraulic lifts and presses",
            "Air cushions in shoes",
            "Inflatable structures",
        ],
    },
    30: {
        "name": "Flexible shells and thin films",
        "description": "Use flexible shells and thin films instead of three-dimensional structures",
        "examples": [
            "Inflatable structures",
            "Heat shrinkable tubing",
            "Thin film solar cells",
        ],
    },
    31: {
        "name": "Porous materials",
        "description": "Make an object porous or add porous elements",
        "examples": [
            "Drilling holes in a structure to reduce weight",
            "Porous pavement for water drainage",
            "Foam core structures",
        ],
    },
    32: {
        "name": "Color changes",
        "description": "Change the color of an object or its external environment",
        "examples": ["Mood rings", "Chameleon fabrics", "Heat-sensitive inks"],
    },
    33: {
        "name": "Homogeneity",
        "description": "Make objects interact with a given object of the same material",
        "examples": [
            "Diamond cutting diamond",
            "Borosilicate glass containers for acids",
            "Self-healing materials of same composition",
        ],
    },
    34: {
        "name": "Discarding and recovering",
        "description": "Make portions of an object that have fulfilled their functions go away",
        "examples": [
            "Dissolving medicine capsules",
            "Biodegradable packaging",
            "Ablative heat shields",
        ],
    },
    35: {
        "name": "Parameter changes",
        "description": "Change an object's physical state or concentration",
        "examples": [
            "Freezing water to change its properties",
            "Liquefying oxygen for storage",
            "Converting powders to pellets",
        ],
    },
    36: {
        "name": "Phase transitions",
        "description": "Use phenomena occurring during phase transitions",
        "examples": [
            "Heat pumps using phase transitions",
            "Freeze drying",
            "Shape memory alloys",
        ],
    },
    37: {
        "name": "Thermal expansion",
        "description": "Use thermal expansion (or contraction) of materials",
        "examples": [
            "Thermal fit of parts",
            "Bimetallic thermostat",
            "Thermohydraulic engine",
        ],
    },
    38: {
        "name": "Strong oxidants",
        "description": "Replace common air with enriched air or pure oxygen",
        "examples": [
            "Oxygen breathing for mountain climbers",
            "Enriched air for metal cutting",
            "Ozone water treatment",
        ],
    },
    39: {
        "name": "Inert atmosphere",
        "description": "Replace a normal environment with an inert one",
        "examples": [
            "Argon atmosphere for welding reactive metals",
            "Nitrogen blanket for flammable liquids",
            "Vacuum packaging for food",
        ],
    },
    40: {
        "name": "Composite materials",
        "description": "Change from uniform to composite materials",
        "examples": ["Fiberglass", "Carbon fiber composites", "Reinforced concrete"],
    },
}

# The 39 Engineering Parameters in TRIZ
ENGINEERING_PARAMETERS = {
    1: "Weight of moving object",
    2: "Weight of stationary object",
    3: "Length of moving object",
    4: "Length of stationary object",
    5: "Area of moving object",
    6: "Area of stationary object",
    7: "Volume of moving object",
    8: "Volume of stationary object",
    9: "Speed",
    10: "Force",
    11: "Stress or pressure",
    12: "Shape",
    13: "Stability of the object's composition",
    14: "Strength",
    15: "Duration of action of moving object",
    16: "Duration of action of stationary object",
    17: "Temperature",
    18: "Illumination intensity",
    19: "Use of energy by moving object",
    20: "Use of energy by stationary object",
    21: "Power",
    22: "Loss of energy",
    23: "Loss of substance",
    24: "Loss of information",
    25: "Loss of time",
    26: "Quantity of substance/matter",
    27: "Reliability",
    28: "Measurement accuracy",
    29: "Manufacturing precision",
    30: "External harm affects the object",
    31: "Object-generated harmful factors",
    32: "Ease of manufacture",
    33: "Ease of operation",
    34: "Ease of repair",
    35: "Adaptability or versatility",
    36: "Device complexity",
    37: "Difficulty of detecting and measuring",
    38: "Extent of automation",
    39: "Productivity",
}

# The 39x39 Contradiction Matrix
# Format: Matrix[worsening_parameter][improving_parameter] = [list of principles]
# The first index is the worsening parameter (1-39)
# The second index is the improving parameter (1-39)
# The value is a list of principle numbers (1-40) that can be applied
CONTRADICTION_MATRIX = {
    # Weight of moving object (row 1)
    1: {
        1: [],  # Self-contradiction
        2: [10, 1, 29, 35],
        3: [29, 17, 38, 34],
        4: [29, 2, 40, 28],
        5: [2, 17, 29, 4],
        6: [2, 29, 40, 4],
        7: [1, 7, 4, 35],
        8: [1, 7, 4, 17],
        9: [2, 28, 13, 38],
        10: [8, 10, 18, 37],
        11: [10, 36, 37, 40],
        12: [5, 35, 14, 2],
        13: [35, 3, 22, 39],
        14: [28, 40, 29, 34],
        15: [19, 5, 34, 31],
        16: [2, 19, 9, 35],
        17: [19, 2, 35, 32],
        18: [19, 32, 35, 2],
        19: [6, 18, 26, 31],
        20: [19, 26, 17, 10],
        21: [35, 6, 18, 31],
        22: [19, 18, 26, 31],
        23: [21, 35, 2, 39],
        24: [26, 39, 1, 40],
        25: [35, 38, 19, 18],
        26: [35, 6, 18, 31],
        27: [27, 3, 26, 18],
        28: [28, 27, 3, 18],
        29: [10, 28, 29, 37],
        30: [10, 28, 23, 18],
        31: [21, 35, 11, 28],
        32: [35, 13, 8, 1],
        33: [2, 27, 28, 11],
        34: [1, 28, 10, 25],
        35: [1, 26, 13, 27],
        36: [26, 27, 13, 1],
        37: [26, 27, 13, 28],
        38: [28, 26, 27, 1],
        39: [35, 26, 24, 37],
    },
    # Weight of stationary object (row 2)
    2: {
        1: [10, 1, 29, 35],
        2: [],  # Self-contradiction
        3: [1, 40, 26, 27],
        4: [26, 27, 1, 39],
        5: [1, 7, 4, 35],
        6: [1, 7, 4, 17],
        7: [1, 7, 4, 35],
        8: [1, 7, 4, 17],
        9: [28, 10, 1, 39],
        10: [15, 10, 26, 35],
        11: [10, 15, 26, 35],
        12: [10, 15, 26, 28],
        13: [3, 35, 10, 40],
        14: [30, 26, 10, 40],
        15: [10, 26, 35, 17],
        16: [10, 35, 17, 4],
        17: [19, 35, 10, 38],
        18: [2, 35, 10, 39],
        19: [28, 19, 32, 22],
        20: [28, 19, 34, 22],
        21: [19, 17, 10, 35],
        22: [35, 19, 10, 38],
        23: [28, 35, 10, 40],
        24: [35, 10, 28, 24],
        25: [35, 10, 2, 18],
        26: [28, 35, 10, 23],
        27: [3, 10, 8, 28],
        28: [10, 28, 35, 23],
        29: [10, 28, 24, 35],
        30: [10, 35, 17, 27],
        31: [35, 10, 28, 24],
        32: [10, 35, 13, 19],
        33: [10, 28, 29, 35],
        34: [2, 10, 27, 35],
        35: [28, 35, 10, 29],
        36: [28, 29, 37, 36],
        37: [26, 28, 10, 34],
        38: [28, 26, 10, 34],
        39: [28, 10, 29, 35],
    },
    # (rows 3-39 similarly defined)
    # For brevity, the rest of the matrix is represented similarly
    3: {  # Length of moving object
        1: [29, 17, 38, 34],
        2: [1, 40, 26, 27],
        3: [],  # Self-contradiction
        4: [15, 17, 4],
        5: [17, 10, 4],
        6: [17, 2, 18, 39],
        7: [17, 10, 4],
        8: [17, 10, 4, 30],
        9: [13, 4, 8],
        10: [8, 1, 37, 18],
        11: [10, 15, 19],
        12: [5, 34, 4, 10],
        13: [35, 28, 31, 40],
        14: [1, 8, 10, 29],
        15: [14, 15, 1, 16],
        16: [1, 19, 26, 17],
        17: [15, 19, 35, 38],
        18: [35, 10, 19, 14],
        19: [35, 8, 2, 14],
        20: [17, 19, 10],
        21: [10, 35, 19, 14],
        22: [7, 2, 6, 35],
        23: [4, 6, 2],
        24: [10, 35, 19, 14],
        25: [10, 28, 32],
        26: [1, 15, 17, 24],
        27: [11, 2, 13, 39],
        28: [28, 32, 1, 24],
        29: [32, 28, 3, 1],
        30: [2, 32, 13, 10],
        31: [21, 35, 11, 28],
        32: [35, 1, 16, 11],
        33: [1, 32, 17, 25],
        34: [11, 1, 2, 9],
        35: [17, 15, 16, 22],
        36: [17, 24, 26, 16],
        37: [14, 4, 15, 22],
        38: [2, 18, 17, 15],
        39: [17, 24, 26, 16],
    },
    # Rows 4-39 would follow a similar pattern
    # This is a compressed representation for readability
    # In a real implementation, all rows and cells would be filled out
    4: {  # Length of stationary object
        1: [29, 2, 40, 28],
        2: [26, 27, 1, 39],
        3: [15, 17, 4],
        4: [],  # Self-contradiction
        # other columns would be filled in similarly
    },
    # And so on for parameters 5-39
}

# This is a simplified version for demonstration
# A complete implementation would have all 39x39 matrix entries filled out
