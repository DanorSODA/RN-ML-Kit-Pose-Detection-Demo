//
//  PoseDetectorFrameProcessorPlugin.m
//  RNMLKitPoseDetectionDemo
//
//  Created by Danor S.O.D.A on 25/11/2024.
//

#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>

#import "RNMLKitPoseDetectionDemo-Swift.h"

VISION_EXPORT_SWIFT_FRAME_PROCESSOR(PoseDetectorFrameProcessorPlugin, detectPose)
