import type { Frame, FrameProcessorPlugin } from "./types";
import { VisionCameraProxy } from "react-native-vision-camera";

const plugin: FrameProcessorPlugin | undefined =
  VisionCameraProxy.initFrameProcessorPlugin("detectPose", {});

export function detectPose(frame: Frame): any {
  "worklet";
  if (plugin == null) throw new Error();
  return plugin.call(frame);
}
