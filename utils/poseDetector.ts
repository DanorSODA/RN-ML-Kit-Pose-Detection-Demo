/**
 * @file poseDetector.ts
 * @author Danor S.O.D.A
 * @lastEdited 26-11-2024
 *
 * @description
 * Pose detection utility that interfaces with the native ML Kit pose detection
 * through Vision Camera's frame processor plugin system. This file provides the
 * bridge between React Native and the native pose detection implementation.
 *
 * The detector is capable of:
 * - Initializing the ML Kit pose detection plugin
 * - Processing camera frames in real-time
 * - Returning detected pose landmarks
 */
import type { Frame, FrameProcessorPlugin } from "./types";
import { VisionCameraProxy } from "react-native-vision-camera";

/**
 * Initialize the pose detection plugin with Vision Camera
 * call for the Android Plugin "PoseDetectorFrameProcessorPlugin.kt" at the "Android/src/main/appName/RNMLKitPoseDetectionDemo/PoseDetector"
 * and the IOS Plugin "PoseDetectorFrameProcessorPlugin.swift" at the "ios/PoseDetector"
 * @constant {FrameProcessorPlugin | undefined}
 */
const plugin: FrameProcessorPlugin | undefined =
  VisionCameraProxy.initFrameProcessorPlugin("detectPose", {});

/**
 * Processes a camera frame to detect human poses
 *
 * @function detectPose
 * @param {Frame} frame - The camera frame to process
 * @returns {PoseType} Object containing detected pose landmarks
 * @throws {Error} If the plugin is not properly initialized
 *
 * @worklet This function runs on the JS thread marked as a worklet
 */
export function detectPose(frame: Frame): any {
  "worklet";
  if (plugin == null) throw new Error();
  return plugin.call(frame);
}
