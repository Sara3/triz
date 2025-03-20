import { User, Patent, PatentAnalysis, PatentCitation, TrizMatrix, TrizPrinciple, AnalyticsSummary } from './types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@patentanalytics.com',
    role: 'admin',
    avatarUrl: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff'
  },
  {
    id: '2',
    name: 'Engineer User',
    email: 'engineer@patentanalytics.com',
    role: 'engineer',
    avatarUrl: 'https://ui-avatars.com/api/?name=Engineer+User&background=0D8ABC&color=fff'
  }
];

// Mock TRIZ principles data
export const TRIZ_PRINCIPLES: TrizPrinciple[] = [
  {
    id: 1,
    name: 'Segmentation',
    description: 'Divide an object into independent parts',
    examples: ['Modular furniture', 'Sectioned medical devices', 'Multi-component systems']
  },
  {
    id: 2,
    name: 'Extraction',
    description: 'Extract the disturbing part or property from an object',
    examples: ['Extract heat using cooling system', 'Noise cancellation', 'Filtering systems']
  },
  {
    id: 3,
    name: 'Local quality',
    description: 'Change an object\'s structure from uniform to non-uniform',
    examples: ['Graduated surgical instruments', 'Variable stiffness catheters', 'Multi-density materials']
  },
  {
    id: 4,
    name: 'Asymmetry',
    description: 'Change the shape from symmetrical to asymmetrical',
    examples: ['Ergonomic handles', 'Specialized surgical tools', 'Anatomically-designed implants']
  },
  {
    id: 5,
    name: 'Combining',
    description: 'Merge identical or similar objects',
    examples: ['Multi-function medical devices', 'Combined diagnostic tools', 'All-in-one systems']
  },
  {
    id: 6,
    name: 'Universality',
    description: 'Make an object perform multiple functions',
    examples: ['Multi-parameter monitors', 'Combination therapy devices', 'Universal medical instruments']
  },
  {
    id: 7,
    name: 'Nesting',
    description: 'Place one object inside another',
    examples: ['Telescoping instruments', 'Nested storage systems', 'Implantable delivery systems']
  },
  {
    id: 8,
    name: 'Counterweight',
    description: 'Compensate for an object\'s weight',
    examples: ['Balanced surgical tools', 'Counterweighted arms', 'Neutrally buoyant devices']
  },
  {
    id: 9,
    name: 'Preliminary action',
    description: 'Perform required changes to an object in advance',
    examples: ['Pre-sterilized components', 'Pre-calibrated sensors', 'Pre-loaded medications']
  },
  {
    id: 10,
    name: 'Preliminary anti-action',
    description: 'Pre-stress an object to compensate for undesirable effects',
    examples: ['Pre-tensioned springs', 'Counteracting forces', 'Stress-relieved components']
  },
  {
    id: 11,
    name: 'Prior cushioning',
    description: 'Prepare emergency means beforehand',
    examples: ['Backup power systems', 'Redundant components', 'Fail-safe mechanisms']
  },
  {
    id: 12,
    name: 'Equipotentiality',
    description: 'Change operating conditions to eliminate force fields',
    examples: ['Neutral buoyancy in liquids', 'Zero-gravity positioning', 'Balanced pressure systems']
  },
  {
    id: 13,
    name: 'The other way round',
    description: 'Invert the action or process',
    examples: ['Inverse drug delivery', 'Reversed surgical approaches', 'Negative pressure therapy']
  },
  {
    id: 14,
    name: 'Spheroidality',
    description: 'Use curved surfaces instead of flat ones',
    examples: ['Rounded implant edges', 'Curved surgical instruments', 'Anatomical contours']
  },
  {
    id: 15,
    name: 'Dynamics',
    description: 'Allow or design an object to change to optimal operating conditions',
    examples: ['Adjustable parameters', 'Adaptive systems', 'Responsive therapies']
  }
];

export const MOCK_TRIZ_MATRIX: TrizMatrix[] = [
  {
    id: '1',
    improving_parameter: 'Accuracy of measurement',
    worsening_parameter: 'Power consumption',
    suggested_principles: [1, 7, 13],
    matrix_version: '2.0',
    last_updated: '2023-01-15'
  },
  {
    id: '2',
    improving_parameter: 'Device complexity',
    worsening_parameter: 'Ease of manufacture',
    suggested_principles: [7, 9, 6],
    matrix_version: '2.0',
    last_updated: '2023-01-15'
  },
  {
    id: '3',
    improving_parameter: 'Dexterity',
    worsening_parameter: 'Size',
    suggested_principles: [4, 7, 15],
    matrix_version: '2.0',
    last_updated: '2023-01-15'
  },
  {
    id: '4',
    improving_parameter: 'Strength',
    worsening_parameter: 'Weight',
    suggested_principles: [3, 8, 10],
    matrix_version: '2.0',
    last_updated: '2023-01-15'
  },
  {
    id: '5',
    improving_parameter: 'Battery life',
    worsening_parameter: 'Performance',
    suggested_principles: [9, 15, 12],
    matrix_version: '2.0',
    last_updated: '2023-01-15'
  }
];

export const MOCK_ANALYTICS: AnalyticsSummary = {
  total_patents: 5,
  patents_by_status: {
    processing: 1,
    analyzed: 2,
    reviewed: 1,
    error: 1
  },
  review_completion_rate: 60,
  average_confidence_score: 0.86,
  top_contradictions: [
    {
      contradiction: {
        improving_parameter: 'Accuracy of measurement',
        worsening_parameter: 'Power consumption'
      },
      count: 3
    },
    {
      contradiction: {
        improving_parameter: 'Dexterity',
        worsening_parameter: 'Size'
      },
      count: 2
    },
    {
      contradiction: {
        improving_parameter: 'Strength',
        worsening_parameter: 'Weight'
      },
      count: 2
    }
  ],
  top_principles: [
    { principle: 'Segmentation', count: 4 },
    { principle: 'Nesting', count: 3 },
    { principle: 'Dynamics', count: 3 },
    { principle: 'Preliminary action', count: 2 },
    { principle: 'Local quality', count: 2 }
  ]
};

export const getCurrentUser = (): User => {
  return MOCK_USERS[0]; // Default to admin user
};

export const getPrincipleById = (id: number): TrizPrinciple | undefined => {
  return TRIZ_PRINCIPLES.find(principle => principle.id === id);
};

export const getPrincipleByName = (name: string): TrizPrinciple | undefined => {
  return TRIZ_PRINCIPLES.find(principle => 
    principle.name.toLowerCase() === name.toLowerCase()
  );
};

export const getTrizMatrixData = (improvingParam: string, worseningParam: string): TrizMatrix | undefined => {
  return MOCK_TRIZ_MATRIX.find(
    matrix => matrix.improving_parameter === improvingParam && 
              matrix.worsening_parameter === worseningParam
  );
};
