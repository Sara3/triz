
import { TrizContradiction, TrizPrinciple } from "./types";

// The 39 engineering parameters in TRIZ as a constant
export const ENGINEERING_PARAMETERS = [
  "Weight of moving object",
  "Weight of stationary object",
  "Length of moving object",
  "Length of stationary object",
  "Area of moving object",
  "Area of stationary object",
  "Volume of moving object",
  "Volume of stationary object",
  "Speed",
  "Force",
  "Stress or pressure",
  "Shape",
  "Stability of the object's composition",
  "Strength",
  "Duration of action of moving object",
  "Duration of action of stationary object",
  "Temperature",
  "Illumination intensity",
  "Use of energy by moving object",
  "Use of energy by stationary object",
  "Power",
  "Loss of energy",
  "Loss of substance",
  "Loss of information",
  "Loss of time",
  "Quantity of substance",
  "Reliability",
  "Measurement accuracy",
  "Manufacturing precision",
  "Object-affected harmful factors",
  "Object-generated harmful factors",
  "Ease of manufacture",
  "Ease of operation",
  "Ease of repair",
  "Adaptability or versatility",
  "Device complexity",
  "Difficulty of detecting and measuring",
  "Extent of automation",
  "Productivity"
];

// Common predefined contradictions for easy selection
export const COMMON_CONTRADICTIONS: TrizContradiction[] = [
  { improving_parameter: "Speed", worsening_parameter: "Weight of moving object" },
  { improving_parameter: "Strength", worsening_parameter: "Weight of moving object" },
  { improving_parameter: "Reliability", worsening_parameter: "Complexity" },
  { improving_parameter: "Power", worsening_parameter: "Energy loss" },
  { improving_parameter: "Productivity", worsening_parameter: "Complexity" },
  { improving_parameter: "Ease of operation", worsening_parameter: "Device complexity" },
  { improving_parameter: "Adaptability", worsening_parameter: "Reliability" },
  { improving_parameter: "Strength", worsening_parameter: "Complexity" }
];

// A simplified version of the contradiction matrix (same as before)
// This defines which principles are suggested for specific contradictions
export const CONTRADICTION_MATRIX: Record<string, Record<string, number[]>> = {
  "Weight of moving object": {
    "Speed": [2, 28, 13, 38],
    "Strength": [1, 8, 40, 15],
    "Reliability": [3, 8, 10, 40]
  },
  "Speed": {
    "Weight of moving object": [13, 14, 8, 26],
    "Power": [35, 15, 18, 34],
    "Reliability": [21, 35, 11, 28]
  },
  "Reliability": {
    "Weight of moving object": [8, 10, 18, 37],
    "Speed": [11, 35, 27, 28],
    "Complexity": [10, 35, 17, 4]
  },
  "Strength": {
    "Weight of moving object": [10, 1, 29, 35],
    "Complexity": [1, 35, 16, 11],
    "Weight of stationary object": [1, 8, 15, 34]
  },
  "Complexity": {
    "Reliability": [6, 1, 13, 11],
    "Strength": [13, 35, 1, 15],
    "Manufacturing precision": [32, 26, 12, 17]
  },
  "Power": {
    "Speed": [12, 18, 28, 31],
    "Loss of energy": [19, 9, 6, 27],
    "Loss of time": [35, 38, 19, 18]
  }
};

// Default principles to suggest when no specific match is found
export const DEFAULT_PRINCIPLES = ["Segmentation", "Taking out", "Local quality"];

