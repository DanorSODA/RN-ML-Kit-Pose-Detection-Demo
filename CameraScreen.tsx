import React, { useEffect, useState } from "react";
import { StyleSheet, View, Platform, Text } from "react-native";
import {
  Camera,
  CameraPosition,
  useCameraDevice,
  useCameraFormat,
  useSkiaFrameProcessor,
} from "react-native-vision-camera";
import { detectPose } from "./poseDetector";
import type { PoseDetectionOptions, PoseType } from "./types";
import { PaintStyle, Skia } from "@shopify/react-native-skia";

const CameraScreen = () => {
  const [position, setPosition] = useState<CameraPosition>("back");
  const device = useCameraDevice(position);
  const format = useCameraFormat(device, [
    { videoResolution: { width: 1920, height: 1080 } },
    { fps: 60 },
  ]);
  const camerafps = format?.maxFps;
  const pixelFormat = Platform.OS === "ios" ? "rgb" : "yuv";

  const frameProcessor = useSkiaFrameProcessor((frame) => {
    "worklet";
    try {
      frame.render();
      const options: PoseDetectionOptions = {
        mode: "stream",
        performanceMode: "min",
      };
      const pose: PoseType = detectPose(frame, options);
      // for tesing:
      //   console.log("pose:", JSON.stringify(pose, null, 2));

      if (pose) {
        const pointsToDraw = [
          pose.leftShoulder,
          pose.rightShoulder,
          pose.leftHip,
          pose.rightHip,
        ];

        // Draw points
        pointsToDraw.forEach((point) => {
          if (point?.x != null && point?.y != null) {
            const redPaint = Skia.Paint();
            redPaint.setColor(Skia.Color("red"));
            redPaint.setStyle(PaintStyle.Fill);

            frame.drawCircle(point.x, point.y, 10, redPaint);
          }
        });

        // Draw lines connecting points
        const linePaint = Skia.Paint();
        linePaint.setColor(Skia.Color("red"));
        linePaint.setStyle(PaintStyle.Stroke);
        linePaint.setStrokeWidth(4);

        // Connect leftShoulder and leftHip
        if (
          pose.leftShoulder?.x != null &&
          pose.leftShoulder?.y != null &&
          pose.leftHip?.x != null &&
          pose.leftHip?.y != null
        ) {
          frame.drawLine(
            pose.leftShoulder.x,
            pose.leftShoulder.y,
            pose.leftHip.x,
            pose.leftHip.y,
            linePaint
          );
        }

        // Connect rightShoulder and rightHip
        if (
          pose.rightShoulder?.x != null &&
          pose.rightShoulder?.y != null &&
          pose.rightHip?.x != null &&
          pose.rightHip?.y != null
        ) {
          frame.drawLine(
            pose.rightShoulder.x,
            pose.rightShoulder.y,
            pose.rightHip.x,
            pose.rightHip.y,
            linePaint
          );
        }
      }
    } catch (error) {
      console.warn("Error detecting pose:", error);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      if (status === "denied") {
        console.log("Camera permission denied");
      }
    })();
  }, []);

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>No Device</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        format={format}
        pixelFormat={pixelFormat}
        fps={camerafps}
        isActive={true}
        frameProcessor={frameProcessor}
        enableFpsGraph={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});

export default CameraScreen;
