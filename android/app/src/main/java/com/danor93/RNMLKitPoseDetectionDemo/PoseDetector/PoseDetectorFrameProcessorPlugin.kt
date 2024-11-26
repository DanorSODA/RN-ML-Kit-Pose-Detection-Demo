/**
 * PoseDetectorFrameProcessorPlugin
 *
 * Author: Danor S.O.D.A
 * Last Edited: 26-11-2024
 *
 * This file implements a custom frame processor plugin for detecting human poses using Google's ML Kit.
 * The plugin integrates with VisionCamera's frame processing system to analyze frames for pose landmarks.
 * It maps the detected pose landmarks to their respective x and y coordinates in the image space, 
 * returning them in a structured format for React Native.
 */

 package com.danor93.RNMLKitPoseDetectionDemo.PoseDetector

 import android.media.Image
 import com.facebook.react.bridge.WritableNativeMap
 import com.google.android.gms.tasks.Tasks
 import com.google.mlkit.vision.common.InputImage
 import com.google.mlkit.vision.pose.Pose
 import com.google.mlkit.vision.pose.PoseDetection
 import com.google.mlkit.vision.pose.PoseLandmark
 import com.google.mlkit.vision.pose.defaults.PoseDetectorOptions
 import com.mrousavy.camera.frameprocessors.Frame
 import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
 import com.mrousavy.camera.frameprocessors.VisionCameraProxy
 import com.mrousavy.camera.core.types.Orientation
 import java.util.HashMap
 
 /**
  * PoseDetectorFrameProcessorPlugin
  *
  * A plugin for processing camera frames to detect human pose landmarks.
  *
  * @param proxy The VisionCamera proxy instance for frame processing.
  * @param options Additional options for configuring pose detection.
  */
 class PoseDetectorFrameProcessorPlugin(proxy: VisionCameraProxy, options: Map<String, Any>?) : FrameProcessorPlugin() {
 
     // Create a single instance of PoseDetector to reuse
     private val poseDetector = PoseDetection.getClient(
         PoseDetectorOptions.Builder()
             .setDetectorMode(PoseDetectorOptions.STREAM_MODE) // Always use STREAM_MODE for real-time
             .setPreferredHardwareConfigs(PoseDetectorOptions.CPU_GPU)
             .build()
     )
 
     // Track if detector is busy
     private var isProcessing = false
 
     /**
      * Processes the given camera frame to detect pose landmarks.
      *
      * @param frame The camera frame containing the image data.
      * @param arguments Additional arguments for configuring detection modes.
      * @return A HashMap containing detected pose landmarks with their coordinates.
      */
     override fun callback(frame: Frame, arguments: Map<String, Any>?): HashMap<String, Any> {
         // Skip frame if detector is busy
         if (isProcessing) {
             return HashMap()
         }
 
         try {
             isProcessing = true
 
             val mediaImage: Image = frame.image ?: throw Exception("No image available in the frame.")
             val orientation: Orientation = Orientation.fromUnionValue(frame.orientation.toString())
             
             // Create InputImage with YUV_420_888 format for better performance
             val image = InputImage.fromMediaImage(mediaImage, orientation.toSurfaceRotation())
             
             // Process pose detection
             val pose: Pose = Tasks.await(poseDetector.process(image))
 
             // Prepare the map to store pose landmarks
             val map = WritableNativeMap()
 
             /**
              * Adds a detected pose landmark to the result map.
              *
              * @param landmark The detected PoseLandmark.
              * @param landmarkName The name of the landmark as a key in the map.
              */
             fun addLandmarkToMap(landmark: PoseLandmark?, landmarkName: String) {
                 val landmarkMap = WritableNativeMap()
                 landmarkMap.putDouble("x", landmark?.position?.x?.toDouble() ?: 0.0)
                 landmarkMap.putDouble("y", landmark?.position?.y?.toDouble() ?: 0.0)
                 map.putMap(landmarkName, landmarkMap)
             }
 
             // Add all pose landmarks to the result map
             if (pose.allPoseLandmarks.isNotEmpty()) {
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.LEFT_SHOULDER), "leftShoulder")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.RIGHT_SHOULDER), "rightShoulder")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.LEFT_ELBOW), "leftElbow")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.RIGHT_ELBOW), "rightElbow")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.LEFT_WRIST), "leftWrist")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.RIGHT_WRIST), "rightWrist")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.LEFT_HIP), "leftHip")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.RIGHT_HIP), "rightHip")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.LEFT_KNEE), "leftKnee")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.RIGHT_KNEE), "rightKnee")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.LEFT_ANKLE), "leftAnkle")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.RIGHT_ANKLE), "rightAnkle")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.LEFT_PINKY), "leftPinky")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.RIGHT_PINKY), "rightPinky")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.LEFT_INDEX), "leftIndex")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.RIGHT_INDEX), "rightIndex")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.LEFT_THUMB), "leftThumb")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.RIGHT_THUMB), "rightThumb")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.LEFT_HEEL), "leftHeel")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.RIGHT_HEEL), "rightHeel")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.LEFT_FOOT_INDEX), "leftFootIndex")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.RIGHT_FOOT_INDEX), "rightFootIndex")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.NOSE), "nose")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.LEFT_EYE_INNER), "leftEyeInner")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.LEFT_EYE), "leftEye")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.LEFT_EYE_OUTER), "leftEyeOuter")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.RIGHT_EYE_INNER), "rightEyeInner")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.RIGHT_EYE), "rightEye")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.RIGHT_EYE_OUTER), "rightEyeOuter")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.LEFT_EAR), "leftEar")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.RIGHT_EAR), "rightEar")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.LEFT_MOUTH), "leftMouth")
                 addLandmarkToMap(pose.getPoseLandmark(PoseLandmark.RIGHT_MOUTH), "rightMouth")
             }
 
             return map.toHashMap()
         } catch (e: Exception) {
             throw Exception("Error processing pose detection: ${e.message}")
         } finally {
             isProcessing = false
         }
     }
 }
 