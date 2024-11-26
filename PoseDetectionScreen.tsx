/**
 * @file PoseDetectionScreen.tsx
 * @author Danor S.O.D.A
 * @lastEdited 26-11-2024
 *
 * @description
 * PoseDetectionScreen is a React Native component that implements real-time pose detection
 * using the device's camera. It utilizes Vision Camera for camera access and ML Kit
 * for pose detection, rendering skeletal overlays on detected poses.
 *
 * Features:
 * - Real-time pose detection and visualization
 * - Camera flip functionality (front/back)
 * - Colored skeletal connections
 * - FPS monitoring
 */
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
import { PoseConnections, type PoseType } from "./utils/types";
import { PaintStyle, Skia } from "@shopify/react-native-skia";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

/**
 * PoseDetectionScreen Component
 *
 * @component
 * @returns {JSX.Element} The rendered camera screen component
 */
const PoseDetectionScreen = () => {
  // State for managing camera position (front/back)
  const [position, setPosition] = useState<CameraPosition>("back");
  // Camera setup hooks
  const device = useCameraDevice(position);
  const format = useCameraFormat(device, [
    { videoResolution: { width: 1920, height: 1080 } },
    { fps: 60 },
  ]);
  const camerafps = format?.maxFps;
  const pixelFormat = Platform.OS === "ios" ? "rgb" : "yuv";

  /**
   * Frame processor for pose detection and visualization
   * Processes each frame to detect poses and draw skeletal overlays
   */
  const frameProcessor = useSkiaFrameProcessor((frame) => {
    "worklet";
    try {
      frame.render();
      const poses: PoseType = detectPose(frame);

      if (poses) {
        // Point visualization setup
        const pointPaint = Skia.Paint();
        pointPaint.setColor(Skia.Color("white"));
        pointPaint.setStyle(PaintStyle.Fill);

        // Draw landmark points
        Object.entries(poses).forEach(([_, point]) => {
          if (point?.x != null && point?.y != null) {
            frame.drawCircle(point.x, point.y, 8, pointPaint);
          }
        });

        // Draw skeletal connections
        PoseConnections.forEach(
          ({ points: [startPoint, endPoint], color, width }) => {
            const start = poses[startPoint as keyof PoseType];
            const end = poses[endPoint as keyof PoseType];

            if (
              start?.x != null &&
              start?.y != null &&
              end?.x != null &&
              end?.y != null
            ) {
              const linePaint = Skia.Paint();
              linePaint.setColor(Skia.Color(color));
              linePaint.setStyle(PaintStyle.Stroke);
              linePaint.setStrokeWidth(width);

              frame.drawLine(start.x, start.y, end.x, end.y, linePaint);
            }
          }
        );
      }
    } catch (error) {
      console.warn("Error detecting pose:", error);
    }
  }, []);

  /**
   * Request camera permissions on component mount
   */
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      if (status === "denied") {
        console.log("Camera permission denied");
      }
    })();
  }, []);

  // Return early if no camera device is available
  if (!device) {
    return (
      <View style={styles.container}>
        <Text>No Device</Text>
      </View>
    );
  }

  /**
   * Toggle between front and back camera
   */
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

/**
 * Component styles
 */
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

export default PoseDetectionScreen;
