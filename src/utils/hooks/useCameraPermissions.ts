/**
 * @fileoverview Camera permissions hook for handling camera access
 * @author Danor S.O.D.A
 * @lastEdit 26-11-2024
 * @description This hook is used to manage camera permissions for the PoseDetectionScreen.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Camera } from "react-native-vision-camera";

type PermissionStatus = "authorized" | "denied" | "not-determined";

interface CameraPermissionsReturn {
  /** Current status of camera permission */
  status: PermissionStatus;
  /** Function to request camera permission again */
  requestPermission: () => Promise<void>;
  /** Whether the initial permission check has completed */
  isLoading: boolean;
}

/**
 * Custom hook for managing camera permissions
 *
 * @returns {CameraPermissionsReturn} Object containing permission status and controls
 */
export const useCameraPermissions = (): CameraPermissionsReturn => {
  const [status, setStatus] = useState<PermissionStatus>("not-determined");
  const [isLoading, setIsLoading] = useState(true);

  const requestPermission = useCallback(async () => {
    try {
      const result = await Camera.requestCameraPermission();
      setStatus(result as PermissionStatus);
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      setStatus("denied");
    }
  }, []);

  const checkPermission = useCallback(async () => {
    try {
      const result = await Camera.getCameraPermissionStatus();
      setStatus(result as PermissionStatus);
    } catch (error) {
      console.error("Error checking camera permission:", error);
      setStatus("denied");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return useMemo(
    () => ({
      status,
      requestPermission,
      isLoading,
    }),
    [status, requestPermission, isLoading]
  );
};
