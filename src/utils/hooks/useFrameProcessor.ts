/**
 * @file Frame processor hook for pose detection and visualization
 * @author Danor S.O.D.A
 * @lastEdit 26-11-2024
 * @description Processes camera frames to detect poses and draw skeletal overlays
 */

import { useSkiaFrameProcessor } from "react-native-vision-camera";
import { detectPose, usePoseDetectionPlugin } from "../poseDetector";
import { PoseConnections, PoseType } from "../types";
import { PaintStyle, Skia } from "@shopify/react-native-skia";

/**
 * Custom hook for processing camera frames and detecting poses
 *
 * @returns Frame processor function for VisionCamera
 */
export const useFrameProcessor = () => {
  const plugin = usePoseDetectionPlugin();

  return useSkiaFrameProcessor((frame) => {
    "worklet";
    try {
      frame.render();
      const poses: PoseType = detectPose(frame, plugin);

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
};
