/**
 * PoseDetectorFrameProcessorPlugin
 *
 * Author: Danor S.O.D.A
 * Last Edited: 2024-11-25
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
 
     /**
      * Processes the given camera frame to detect pose landmarks.
      *
      * @param frame The camera frame containing the image data.
      * @param arguments Additional arguments for configuring detection modes.
      * @return A HashMap containing detected pose landmarks with their coordinates.
      */
     override fun callback(frame: Frame, arguments: Map<String, Any>?): HashMap<String, Any> {
         try {
             // Configure Pose Detector options
             val optionsBuilder = PoseDetectorOptions.Builder()
 
             // Set detection mode based on input arguments
             val mode = if (arguments?.get("mode") == "stream") {
                 PoseDetectorOptions.STREAM_MODE
             } else {
                 PoseDetectorOptions.SINGLE_IMAGE_MODE
             }
             optionsBuilder.setDetectorMode(mode)
 
             // Set performance mode based on input arguments
             val performanceMode = if (arguments?.get("performanceMode") == "min") {
                 PoseDetectorOptions.CPU
             } else {
                 PoseDetectorOptions.CPU_GPU
             }
             optionsBuilder.setPreferredHardwareConfigs(performanceMode)
 
             // Initialize the pose detector
             val poseDetector = PoseDetection.getClient(optionsBuilder.build())
 
             // Extract the image and orientation from the frame
             val mediaImage: Image = frame.image ?: throw Exception("No image available in the frame.")
             val orientation: Orientation = Orientation.fromUnionValue(frame.orientation.toString())
 
             // Create an InputImage instance for ML Kit
             val image = InputImage.fromMediaImage(mediaImage, orientation.toSurfaceRotation())
             
             // Perform pose detection
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
         }
     }
 }
 