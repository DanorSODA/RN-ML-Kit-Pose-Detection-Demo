//
//  PoseDetectorFrameProcessorPlugin.swift
//  RNMLKitPoseDetectionDemo
//
//  Author: Danor S.O.D.A
//  Last Edited: 26/11/2024
//
//  This file defines a custom frame processor plugin for detecting human poses using ML Kit.
//  It integrates with VisionCamera to process frames and extract pose landmarks in real time.
//  The detected landmarks are returned as x and y coordinates within a dictionary structure.
//

import MLKit
import VisionCamera

/// PoseDetectorFrameProcessorPlugin
///
/// A VisionCamera plugin leveraging ML Kit's Pose Detector to detect human poses in real-time frames.
/// It extracts pose landmarks with a confidence threshold and returns them as key-value pairs.
@objc(PoseDetectorFrameProcessorPlugin)
public class PoseDetectorFrameProcessorPlugin: FrameProcessorPlugin {
    // Pose Detector Options: Configured for optimized streaming mode
    private lazy var options: PoseDetectorOptions = {
        let options = PoseDetectorOptions()
        options.detectorMode = .stream
        return options
    }()
    
    // Lazy initialization of the Pose Detector
    private lazy var poseDetector: PoseDetector = {
        return PoseDetector.poseDetector(options: options)
    }()

    /// Initializes the PoseDetectorFrameProcessorPlugin with the VisionCamera proxy holder and optional configurations.
    ///
    /// - Parameters:
    ///   - proxy: The VisionCamera proxy holder.
    ///   - options: Optional configurations for custom detection settings.
    public override init(proxy: VisionCameraProxyHolder, options: [AnyHashable : Any]! = [:]) {
        super.init(proxy: proxy, options: options)
    }

    /// Processes the camera frame to detect human poses and landmarks.
    ///
    /// - Parameters:
    ///   - frame: The frame containing image data and its orientation.
    ///   - arguments: Additional parameters to adjust processing behavior.
    /// - Returns: A dictionary containing pose landmarks with their x and y coordinates.
    public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable : Any]?) -> Any {
        let visionImage = VisionImage(buffer: frame.buffer)
        visionImage.orientation = frame.orientation

        var result: [String: Any] = [:]
        do {
            // Synchronously detect poses in the current frame
            let poses = try poseDetector.results(in: visionImage)
            
            // Process only the first detected pose for better performance
            if let pose = poses.first {
                PoseLandmarkWrapper.allCases.forEach { landmarkType in
                    if let landmarkData = getLandmarkData(pose: pose, type: landmarkType) {
                        result[landmarkType.description] = landmarkData
                    }
                }
            }
        } catch {
            print("Pose detection error: \(error.localizedDescription)")
        }

        return result
    }

    /// Extracts coordinates for a specific pose landmark if its confidence is sufficient.
    ///
    /// - Parameters:
    ///   - pose: The detected pose containing all landmarks.
    ///   - type: The specific landmark type to retrieve data for.
    /// - Returns: A dictionary with `x` and `y` coordinates if likelihood is above 50%; otherwise, nil.
    private func getLandmarkData(pose: Pose, type: PoseLandmarkWrapper) -> [String: CGFloat]? {
        let landmark = pose.landmark(ofType: type.poseLandmarkType)
        guard landmark.inFrameLikelihood > 0.5 else { return nil }
        return ["x": landmark.position.x, "y": landmark.position.y]
    }
}

/// PoseLandmarkWrapper: Enum encapsulating all possible PoseLandmarkTypes.
///
/// Provides utility to iterate over all ML Kit Pose landmarks, map them to PoseLandmarkType,
/// and generate string descriptions for debugging or dictionary keys.
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

    /// Maps the enum case to its corresponding PoseLandmarkType.
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

    /// Generates a human-readable description of the landmark type.
    var description: String {
        return String(describing: self)
    }
}
