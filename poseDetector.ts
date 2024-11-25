import type {
  Frame,
  FrameProcessorPlugin,
  PoseDetectionOptions,
} from "./types";
import { VisionCameraProxy } from "react-native-vision-camera";

const plugin: FrameProcessorPlugin | undefined =
  VisionCameraProxy.initFrameProcessorPlugin("detectPose", {});

export function detectPose(frame: Frame, options: PoseDetectionOptions): any {
  "worklet";
  if (plugin == null) throw new Error();
  // @ts-ignore
  return options ? plugin.call(frame, options) : plugin.call(frame);
}
