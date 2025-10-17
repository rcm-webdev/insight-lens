export type ModelType = 'classification' | 'segmentation' | 'detection' | 'custom';
export type ModelStatus = 'available' | 'loading' | 'unavailable' | 'error';

export interface AIModel {
  id: string;
  name: string;
  description: string;
  type: ModelType;
  version: string;
  status: ModelStatus;
  capabilities: string[];
  inputSize: {
    width: number;
    height: number;
  };
  fileSize: number; // in MB
  accuracy?: number; // percentage
  inference_time?: number; // milliseconds
  diseases?: string[]; // for medical models
  lastUpdated: string; // ISO date string
  author?: string;
  isLocal: boolean;
}

export interface ModelSelection {
  modelId: string;
  model: AIModel;
  selectedAt: Date;
  parameters?: ModelParameters;
}

export interface ModelParameters {
  confidenceThreshold?: number;
  batchSize?: number;
  useGPU?: boolean;
  [key: string]: any;
}

export interface ModelCategory {
  id: string;
  name: string;
  description: string;
  models: AIModel[];
}

// Mock data for development
export const MOCK_MODELS: AIModel[] = [
  {
    id: 'retina-dr-v2',
    name: 'Diabetic Retinopathy Classifier',
    description: 'Detects and classifies stages of diabetic retinopathy from fundus images',
    type: 'classification',
    version: '2.1.0',
    status: 'available',
    capabilities: ['DR Detection', 'Severity Grading', 'Multi-class Classification'],
    inputSize: { width: 512, height: 512 },
    fileSize: 45.2,
    accuracy: 94.5,
    inference_time: 120,
    diseases: ['No DR', 'Mild', 'Moderate', 'Severe', 'Proliferative DR'],
    lastUpdated: '2024-12-15T00:00:00Z',
    author: 'InsightLens Research',
    isLocal: true
  },
  {
    id: 'oct-amd-detect',
    name: 'AMD Detection Model',
    description: 'Identifies age-related macular degeneration from OCT scans',
    type: 'classification',
    version: '1.5.2',
    status: 'available',
    capabilities: ['AMD Detection', 'Dry/Wet Classification', 'Drusen Analysis'],
    inputSize: { width: 496, height: 512 },
    fileSize: 38.7,
    accuracy: 91.2,
    inference_time: 95,
    diseases: ['Normal', 'Dry AMD', 'Wet AMD'],
    lastUpdated: '2024-11-20T00:00:00Z',
    author: 'InsightLens Research',
    isLocal: true
  },
  {
    id: 'oct-segment-retinal',
    name: 'Retinal Layer Segmentation',
    description: 'Segments retinal layers in OCT images for detailed analysis',
    type: 'segmentation',
    version: '3.0.1',
    status: 'available',
    capabilities: ['Layer Segmentation', 'Thickness Mapping', 'Boundary Detection'],
    inputSize: { width: 512, height: 512 },
    fileSize: 67.5,
    accuracy: 96.8,
    inference_time: 250,
    diseases: ['ILM', 'RPE', 'NFL', 'GCL', 'IPL', 'INL', 'OPL', 'ONL'],
    lastUpdated: '2025-01-10T00:00:00Z',
    author: 'InsightLens Research',
    isLocal: true
  },
  {
    id: 'glaucoma-detector',
    name: 'Glaucoma Risk Assessment',
    description: 'Evaluates glaucoma risk from fundus images and optic disc analysis',
    type: 'classification',
    version: '1.8.0',
    status: 'available',
    capabilities: ['Glaucoma Detection', 'Cup-to-Disc Ratio', 'Risk Scoring'],
    inputSize: { width: 512, height: 512 },
    fileSize: 42.1,
    accuracy: 89.7,
    inference_time: 110,
    diseases: ['No Glaucoma', 'Suspect', 'Moderate', 'Advanced'],
    lastUpdated: '2024-10-05T00:00:00Z',
    author: 'InsightLens Research',
    isLocal: true
  },
  {
    id: 'vessel-segment',
    name: 'Retinal Vessel Segmentation',
    description: 'Segments blood vessels in fundus images for vascular analysis',
    type: 'segmentation',
    version: '2.3.0',
    status: 'available',
    capabilities: ['Vessel Segmentation', 'Vessel Width', 'Tortuosity Analysis'],
    inputSize: { width: 512, height: 512 },
    fileSize: 52.3,
    accuracy: 95.1,
    inference_time: 180,
    diseases: ['Arteries', 'Veins', 'Capillaries'],
    lastUpdated: '2024-09-12T00:00:00Z',
    author: 'InsightLens Research',
    isLocal: true
  },
  {
    id: 'cataract-grade',
    name: 'Cataract Grading System',
    description: 'Grades cataract severity from slit-lamp or fundus images',
    type: 'classification',
    version: '1.2.0',
    status: 'loading',
    capabilities: ['Cataract Detection', 'Severity Grading', 'Type Classification'],
    inputSize: { width: 512, height: 512 },
    fileSize: 34.8,
    accuracy: 87.3,
    inference_time: 85,
    diseases: ['No Cataract', 'Nuclear', 'Cortical', 'Posterior Subcapsular'],
    lastUpdated: '2024-08-22T00:00:00Z',
    author: 'Community Contributor',
    isLocal: false
  }
];

export const MODEL_CATEGORIES: ModelCategory[] = [
  {
    id: 'classification',
    name: 'Classification Models',
    description: 'Identify and classify diseases from medical images',
    models: MOCK_MODELS.filter(m => m.type === 'classification')
  },
  {
    id: 'segmentation',
    name: 'Segmentation Models',
    description: 'Segment anatomical structures and lesions',
    models: MOCK_MODELS.filter(m => m.type === 'segmentation')
  },
  {
    id: 'detection',
    name: 'Detection Models',
    description: 'Detect and locate specific features or abnormalities',
    models: MOCK_MODELS.filter(m => m.type === 'detection')
  }
];