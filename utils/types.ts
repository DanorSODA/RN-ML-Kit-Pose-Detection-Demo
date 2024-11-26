import type { CameraProps } from "react-native-vision-camera";
export type { Frame, FrameProcessorPlugin } from "react-native-vision-camera";

export type Point = {
  x: number;
  y: number;
};

export type PoseType = {
  leftShoulder: Point;
  rightShoulder: Point;
  leftElbow: Point;
  rightElbow: Point;
  leftWrist: Point;
  rightWrist: Point;
  leftHip: Point;
  rightHip: Point;
  leftKnee: Point;
  rightKnee: Point;
  leftAnkle: Point;
  rightAnkle: Point;
  leftPinky: Point;
  rightPinky: Point;
  leftIndex: Point;
  rightIndex: Point;
  leftThumb: Point;
  rightThumb: Point;
  leftHeel: Point;
  rightHeel: Point;
  leftFootIndex: Point;
  rightFootIndex: Point;
  nose: Point;
  leftEyeInner: Point;
  leftEye: Point;
  leftEyeOuter: Point;
  rightEyeInner: Point;
  rightEye: Point;
  rightEyeOuter: Point;
  leftMouth: Point;
  rightMouth: Point;
};

export type CameraTypes = {
  callback: Function;
  options: PoseDetectionOptions;
} & CameraProps;
