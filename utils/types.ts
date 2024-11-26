/**
 * @file types.ts
 * @author Danor S.O.D.A
 * @lastEdited 26-11-2024
 *
 * @description
 * Type definitions for the pose detection system. This file contains all the types
 * and constants related to pose detection, including landmark points and skeletal
 * connections with their visual properties.
 */
import type { CameraProps } from "react-native-vision-camera";
export type { Frame, FrameProcessorPlugin } from "react-native-vision-camera";

/**
 * Represents a 2D point in space
 * @typedef {Object} Point
 */
export type Point = {
  x: number;
  y: number;
};

/**
 * Represents all possible pose landmarks that can be detected
 * Each property is a Point containing x,y coordinates
 * @typedef {Object} PoseType
 */
export type PoseType = {
  // Face landmarks
  nose: Point;
  leftEyeInner: Point;
  leftEye: Point;
  leftEyeOuter: Point;
  rightEyeInner: Point;
  rightEye: Point;
  rightEyeOuter: Point;
  leftMouth: Point;
  rightMouth: Point;

  // Upper body landmarks
  leftShoulder: Point;
  rightShoulder: Point;
  leftElbow: Point;
  rightElbow: Point;
  leftWrist: Point;
  rightWrist: Point;

  // Hand landmarks
  leftPinky: Point;
  rightPinky: Point;
  leftIndex: Point;
  rightIndex: Point;
  leftThumb: Point;
  rightThumb: Point;

  // Lower body landmarks
  leftHip: Point;
  rightHip: Point;
  leftKnee: Point;
  rightKnee: Point;
  leftAnkle: Point;
  rightAnkle: Point;

  // Foot landmarks
  leftHeel: Point;
  rightHeel: Point;
  leftFootIndex: Point;
  rightFootIndex: Point;
};

/**
 * Defines the connections between landmarks to create the skeletal structure
 * Each connection includes the points to connect, color, and line width
 * @constant {Array<{points: [string, string], color: string, width: number}>}
 */
export const PoseConnections = [
  // Face - Purple lines
  {
    points: ["leftEar", "leftEyeOuter"],
    color: "purple",
    width: 8,
  },
  {
    points: ["leftEyeOuter", "leftEye"],
    color: "purple",
    width: 8,
  },
  {
    points: ["leftEye", "leftEyeInner"],
    color: "purple",
    width: 8,
  },
  {
    points: ["leftEyeInner", "nose"],
    color: "purple",
    width: 8,
  },
  {
    points: ["nose", "rightEyeInner"],
    color: "purple",
    width: 8,
  },
  {
    points: ["rightEyeInner", "rightEye"],
    color: "purple",
    width: 8,
  },
  {
    points: ["rightEye", "rightEyeOuter"],
    color: "purple",
    width: 8,
  },
  {
    points: ["rightEyeOuter", "rightEar"],
    color: "purple",
    width: 8,
  },
  {
    points: ["leftMouth", "rightMouth"],
    color: "purple",
    width: 8,
  },

  // Upper body - Red lines
  {
    points: ["leftShoulder", "rightShoulder"],
    color: "red",
    width: 8,
  },
  {
    points: ["leftShoulder", "leftElbow"],
    color: "orange",
    width: 8,
  },
  {
    points: ["rightShoulder", "rightElbow"],
    color: "orange",
    width: 8,
  },
  {
    points: ["leftElbow", "leftWrist"],
    color: "yellow",
    width: 8,
  },
  {
    points: ["rightElbow", "rightWrist"],
    color: "yellow",
    width: 8,
  },

  // Hands - Green lines
  {
    points: ["leftWrist", "leftThumb"],
    color: "lime",
    width: 8,
  },
  {
    points: ["leftWrist", "leftIndex"],
    color: "lime",
    width: 8,
  },
  {
    points: ["leftWrist", "leftPinky"],
    color: "lime",
    width: 8,
  },
  {
    points: ["rightWrist", "rightThumb"],
    color: "lime",
    width: 8,
  },
  {
    points: ["rightWrist", "rightIndex"],
    color: "lime",
    width: 8,
  },
  {
    points: ["rightWrist", "rightPinky"],
    color: "lime",
    width: 8,
  },

  // Torso - Blue lines,
  {
    points: ["leftShoulder", "leftHip"],
    color: "cyan",
    width: 8,
  },
  {
    points: ["rightShoulder", "rightHip"],
    color: "cyan",
    width: 8,
  },
  {
    points: ["leftHip", "rightHip"],
    color: "blue",
    width: 8,
  },

  // Legs - Pink lines
  {
    points: ["leftHip", "leftKnee"],
    color: "magenta",
    width: 8,
  },
  {
    points: ["rightHip", "rightKnee"],
    color: "magenta",
    width: 8,
  },
  {
    points: ["leftKnee", "leftAnkle"],
    color: "pink",
    width: 8,
  },
  {
    points: ["rightKnee", "rightAnkle"],
    color: "pink",
    width: 8,
  },

  // Feet - Brown lines
  {
    points: ["leftAnkle", "leftHeel"],
    color: "brown",
    width: 8,
  },
  {
    points: ["leftHeel", "leftFootIndex"],
    color: "brown",
    width: 8,
  },
  {
    points: ["rightAnkle", "rightHeel"],
    color: "brown",
    width: 8,
  },
  {
    points: ["rightHeel", "rightFootIndex"],
    color: "brown",
    width: 8,
  },
];

/**
 * Extended camera props type that includes a callback function
 * @typedef {Object} CameraTypes
 * @extends {CameraProps}
 */
export type CameraTypes = {
  callback: Function;
} & CameraProps;
