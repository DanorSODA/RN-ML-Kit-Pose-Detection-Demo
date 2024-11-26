/**
 * @file useCamera hook for handling camera device, format, and position
 * @author Danor S.O.D.A
 * @lastEdit 26-11-2024
 * * @description return all the function and states related to camera
 */

import { useCallback, useMemo, useState } from "react";
import {
  CameraPosition,
  useCameraDevice,
  useCameraFormat,
} from "react-native-vision-camera";
import { Platform } from "react-native";

type PixelFormat = "yuv" | "rgb";

/**
 * Interface for camera hook return values
 */
interface CameraHookReturn {
  /** The current camera device */
  device: ReturnType<typeof useCameraDevice>;
  /** The selected camera format */
  format: ReturnType<typeof useCameraFormat>;
  /** Current camera position (front/back) */
  position: CameraPosition;
  /** Maximum frames per second for the current format */
  cameraFps: number | undefined;
  /** Platform-specific pixel format */
  pixelFormat: PixelFormat;
  /** Function to switch between front and back cameras */
  flipCamera: () => void;
}

/**
 * Custom hook for managing camera functionality
 *
 * @returns {CameraHookReturn} Object containing camera configuration and controls
 *
 */
export const useCamera = (): CameraHookReturn => {
  // Initialize camera position state
  const [position, setPosition] = useState<CameraPosition>("back");

  // Get camera device based on position
  const device = useCameraDevice(position);

  // Memoize format preferences
  const formatPreferences = useMemo(
    () => [{ videoResolution: { width: 1920, height: 1080 } }, { fps: 60 }],
    []
  );

  const format = useCameraFormat(device, formatPreferences);

  // Extract maximum FPS from format
  const cameraFps = useMemo(() => format?.maxFps, [format]);

  // Set pixel format based on platform
  const pixelFormat: PixelFormat = useMemo(
    () => (Platform.OS === "ios" ? "rgb" : "yuv"),
    []
  );

  /**
   * Toggles between front and back camera
   */
  const flipCamera = useCallback(
    () => setPosition((pos) => (pos === "front" ? "back" : "front")),
    []
  );

  // Memoize return object
  return useMemo(
    () => ({
      device,
      format,
      position,
      cameraFps,
      pixelFormat,
      flipCamera,
    }),
    [device, format, position, cameraFps, pixelFormat, flipCamera]
  );
};
