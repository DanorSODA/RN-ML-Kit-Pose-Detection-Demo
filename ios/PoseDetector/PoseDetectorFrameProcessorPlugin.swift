//
//  PoseDetectorFrameProcessorPlugin.swift
//  RNMLKitPoseDetectionDemo
//
//  Author: Danor S.O.D.A
//  Last Edited: 25/11/2024
//
//  This file implements a custom frame processor plugin for detecting human poses using ML Kit.
//  It integrates with VisionCamera to process frames and extract pose landmarks.
//  The detected landmarks are mapped to their x and y coordinates and returned as a dictionary.
//

import MLKit
import VisionCamera

/// PoseDetectorFrameProcessorPlugin
///
/// A custom frame processor plugin for VisionCamera that uses ML Kit's Pose Detector
/// to detect and return human pose landmarks in a given camera frame.
@objc(PoseDetectorFrameProcessorPlugin)
public class PoseDetectorFrameProcessorPlugin: FrameProcessorPlugin {
    private var options: PoseDetectorOptions = PoseDetectorOptions()

    /// Initializes the PoseDetectorFrameProcessorPlugin.
    ///
    /// - Parameters:
    ///   - proxy: The VisionCamera proxy holder.
    ///   - options: Configuration options for the plugin.
    public override init(proxy: VisionCameraProxyHolder, options: [AnyHashable : Any]! = [:]) {
        super.init(proxy: proxy, options: options)
    }

    /// Processes the given frame to detect pose landmarks.
    ///
    /// - Parameters:
    ///   - frame: The frame to process, containing image data and orientation.
    ///   - arguments: Optional arguments for configuring detection modes.
    /// - Returns: A dictionary containing pose landmarks and their coordinates.
    public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable : Any]?) -> Any {
        // Set detector mode based on input arguments
        if let mode = arguments?["mode"] as? String {
            switch mode {
            case "stream":
                options.detectorMode = .stream
            case "single":
                options.detectorMode = .singleImage
            default:
                options.detectorMode = .stream
            }
        }

        // Create a VisionImage from the frame buffer
        let buffer = frame.buffer
        let orientation = frame.orientation
        let visionImage = VisionImage(buffer: buffer)
        visionImage.orientation = orientation

        // Initialize the Pose Detector
        let poseDetector = PoseDetector.poseDetector(options: options)

        // Process the image to detect poses
        var result: [String: Any] = [:]
        do {
            let poses = try poseDetector.results(in: visionImage)
            for pose in poses {
                // Extract and map landmarks
                for landmarkType in PoseLandmarkWrapper.allCases {
                    if let landmarkData = getLandmarkData(pose: pose, type: landmarkType) {
                        let landmarkName = landmarkType.description
                        result[landmarkName] = landmarkData
                    }
                }
            }
        } catch {
            print("Error detecting poses: \(error.localizedDescription)")
        }

        return result
    }

    /// Helper function to extract data for a specific pose landmark.
    ///
    /// - Parameters:
    ///   - pose: The Pose object containing landmarks.
    ///   - type: The type of landmark to extract.
    /// - Returns: A dictionary with x and y coordinates of the landmark, or nil if likelihood is low.
    private func getLandmarkData(pose: Pose, type: PoseLandmarkWrapper) -> [String: CGFloat]? {
        let landmark = pose.landmark(ofType: type.poseLandmarkType)
        guard landmark.inFrameLikelihood > 0.5 else {
            return nil
        }
        return ["x": landmark.position.x, "y": landmark.position.y]
    }
}

/// Wrapper for PoseLandmarkType to enumerate all available landmarks.
private enum PoseLandmarkWrapper: CaseIterable {
    case nose, leftEyeInner, leftEye, leftEyeOuter,
         rightEyeInner, rightEye, rightEyeOuter,
         leftEar, rightEar,
         leftShoulder, rightShoulder,
         leftElbow, rightElbow,
         leftWrist, rightWrist,
         leftPinkyFinger, rightPinkyFinger,
         leftIndexFinger, rightIndexFinger,
         leftThumb, rightThumb,
         leftHip, rightHip,
         leftKnee, rightKnee,
         leftAnkle, rightAnkle,
         leftHeel, rightHeel,
         leftToe, rightToe

    /// Maps the enum to the corresponding PoseLandmarkType.
    var poseLandmarkType: PoseLandmarkType {
        switch self {
        case .nose: return .nose
        case .leftEyeInner: return .leftEyeInner
        case .leftEye: return .leftEye
        case .leftEyeOuter: return .leftEyeOuter
        case .rightEyeInner: return .rightEyeInner
        case .rightEye: return .rightEye
        case .rightEyeOuter: return .rightEyeOuter
        case .leftEar: return .leftEar
        case .rightEar: return .rightEar
        case .leftShoulder: return .leftShoulder
        case .rightShoulder: return .rightShoulder
        case .leftElbow: return .leftElbow
        case .rightElbow: return .rightElbow
        case .leftWrist: return .leftWrist
        case .rightWrist: return .rightWrist
        case .leftPinkyFinger: return .leftPinkyFinger
        case .rightPinkyFinger: return .rightPinkyFinger
        case .leftIndexFinger: return .leftIndexFinger
        case .rightIndexFinger: return .rightIndexFinger
        case .leftThumb: return .leftThumb
        case .rightThumb: return .rightThumb
        case .leftHip: return .leftHip
        case .rightHip: return .rightHip
        case .leftKnee: return .leftKnee
        case .rightKnee: return .rightKnee
        case .leftAnkle: return .leftAnkle
        case .rightAnkle: return .rightAnkle
        case .leftHeel: return .leftHeel
        case .rightHeel: return .rightHeel
        case .leftToe: return .leftToe
        case .rightToe: return .rightToe
        }
    }

    /// Converts the enum to its string description.
    var description: String {
        String(describing: self)
    }
}
