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
import React, { useCallback } from "react";
import {
  StyleSheet,
  View,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import { Camera } from "react-native-vision-camera";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useCamera } from "./utils/hooks/useCamera";
import { useFrameProcessor } from "./utils/hooks/useFrameProcessor";
import { useCameraPermissions } from "./utils/hooks/useCameraPermissions";
/**
 * PoseDetectionScreen Component
 *
 * @component
 * @returns {JSX.Element} The rendered camera screen component
 */
const PoseDetectionScreen = () => {
  const { device, format, cameraFps, pixelFormat, flipCamera } = useCamera();
  const frameProcessor = useFrameProcessor();
  const { status, requestPermission, isLoading } = useCameraPermissions();

  const handlePermissionRequest = useCallback(() => {
    requestPermission();
  }, [requestPermission]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (status === "denied") {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Camera permission is required to use this feature.
        </Text>
        <Text style={styles.subPermissionText}>
          Please grant camera access to continue.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={handlePermissionRequest}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Return early if no camera device is available
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
        fps={cameraFps}
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
  permissionText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "600",
  },
  subPermissionText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  permissionButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PoseDetectionScreen;
