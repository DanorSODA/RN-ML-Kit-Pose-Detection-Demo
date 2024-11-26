import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Platform, Text } from "react-native";
import {
  Camera,
  CameraPosition,
  useCameraDevice,
  useCameraFormat,
  useSkiaFrameProcessor,
} from "react-native-vision-camera";
import { detectPose } from "./utils/poseDetector";
import type { PoseType } from "./utils/types";
import { PaintStyle, Skia } from "@shopify/react-native-skia";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

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
      const poses: PoseType = detectPose(frame);
      // for tesing:
      //   console.log("pose:", JSON.stringify(pose, null, 2));

      if (poses) {
        const pointsToDraw = [
          poses.leftShoulder,
          poses.rightShoulder,
          poses.leftHip,
          poses.rightHip,
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
          poses.leftShoulder?.x != null &&
          poses.leftShoulder?.y != null &&
          poses.leftHip?.x != null &&
          poses.leftHip?.y != null
        ) {
          frame.drawLine(
            poses.leftShoulder.x,
            poses.leftShoulder.y,
            poses.leftHip.x,
            poses.leftHip.y,
            linePaint
          );
        }

        // Connect rightShoulder and rightHip
        if (
          poses.rightShoulder?.x != null &&
          poses.rightShoulder?.y != null &&
          poses.rightHip?.x != null &&
          poses.rightHip?.y != null
        ) {
          frame.drawLine(
            poses.rightShoulder.x,
            poses.rightShoulder.y,
            poses.rightHip.x,
            poses.rightHip.y,
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

  const flipCamera = useCallback(() => {
    setPosition((pos) => (pos === "front" ? "back" : "front"));
  }, []);

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

      {/* Flip Camera Button */}
      <MaterialIcons
        name={Platform.OS === "ios" ? "flip-camera-ios" : "flip-camera-android"}
        size={40}
        color="white"
        style={styles.flipButton}
        onPress={flipCamera}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  flipButton: {
    position: "absolute",
    bottom: 30,
    left: 20,
    padding: 10,
  },
});

export default CameraScreen;
