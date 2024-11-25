/**
 * PoseDetectorFrameProcessorPluginPackage
 *
 * Author: Danor S.O.D.A
 * Last Edited: 2024-11-25
 *
 * This file defines a React Native package for integrating the Pose Detector Frame Processor plugin
 * with the VisionCamera library. The package registers the "detectPose" frame processor plugin,
 * enabling pose detection functionality in the VisionCamera framework for React Native.
 */

 package com.danor93.RNMLKitPoseDetectionDemo.PoseDetector

 import com.facebook.react.ReactPackage
 import com.facebook.react.bridge.NativeModule
 import com.facebook.react.bridge.ReactApplicationContext
 import com.facebook.react.uimanager.ViewManager
 import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
 import com.mrousavy.camera.frameprocessors.FrameProcessorPluginRegistry
 
 /**
  * PoseDetectorFrameProcessorPluginPackage
  *
  * A React Native package for the Pose Detector Frame Processor Plugin.
  * This package registers the custom frame processor plugin, "detectPose", 
  * with VisionCamera's FrameProcessorPluginRegistry.
  */
 class PoseDetectorFrameProcessorPluginPackage : ReactPackage {
 
   companion object {
     init {
       // Register the custom frame processor plugin "detectPose"
       FrameProcessorPluginRegistry.addFrameProcessorPlugin("detectPose") { proxy, options ->
         PoseDetectorFrameProcessorPlugin(proxy, options)
       }
     }
   }
 
   /**
    * Creates a list of native modules to be registered in the React Native context.
    * 
    * @param reactContext The React Native application context.
    * @return An empty list, as this package does not provide native modules.
    */
   override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
     return emptyList()
   }
 
   /**
    * Creates a list of view managers to be registered in the React Native context.
    * 
    * @param reactContext The React Native application context.
    * @return An empty list, as this package does not provide view managers.
    */
   override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
     return emptyList()
   }
 }
 