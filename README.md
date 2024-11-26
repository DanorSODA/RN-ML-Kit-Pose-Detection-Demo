# React Native ML Kit Pose Detection Demo

A React Native application that demonstrates real-time pose detection using ML Kit Vision, VisionCamera, and Skia for rendering. The app detects human body poses through the device camera and draws skeletal points and connections in real-time.

## Features

- Real-time pose detection using ML Kit Vision
- Support for both iOS and Android platforms
- High-performance frame processing
- Visual rendering of pose landmarks using Skia
- Configurable detection modes (stream/single) and performance settings
- Camera controls (front/back switching)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or newer)
- Yarn package manager
- iOS development environment (Xcode 12 or newer)
- Android development environment (Android Studio, SDK)
- CocoaPods (for iOS)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/danor93/RNMLKitPoseDetectionDemo.git
```

2. Install dependencies:

```bash
yarn install
```

3. Install iOS dependencies:

```bash
npx pod-install
```

4. create a Dev Build:

For iOS:

```bash
yarn ios
```

For Android:

```bash
yarn clean-android
yarn android
```

## Project Structure

```tree
RNMLKitPoseDetectionDemo/
├── [android/] # Android native code
│ └── [app/]
│ └── [src/]
│ └── [main/]
│ └── [java/]
│ └── [com/]
│ └── [danor93/]
│ └── [RNMLKitPoseDetectionDemo/]
│ └── [PoseDetector/]
│ └── [PoseDetectorFrameProcessorPlugin.kt]
├── [ios/] # iOS native code
│ └── [PoseDetector/]
│ └── [PoseDetectorFrameProcessorPlugin.swift]
├── [utils/]
│ └── [poseDetector.ts] # Pose detection wrapper
│ └── [types.ts] # TypeScript definitions
├── [PoseDetectionScreen.tsx] # Main camera view component
├── [package.json]
└── README.md
```

### File Links

- [PoseDetectorFrameProcessorPlugin.kt](android/app/src/main/java/com/danor93/RNMLKitPoseDetectionDemo/PoseDetector/PoseDetectorFrameProcessorPlugin.kt)
- [PoseDetectorFrameProcessorPlugin.swift](ios/PoseDetector/PoseDetectorFrameProcessorPlugin.swift)
- [PoseDetectionScreen.tsx](./PoseDetectionScreen.tsx)
- [poseDetector.ts](./utils/poseDetector.ts)
- [types.ts](./utils/types.ts)

```

## Usage

The app will request camera permissions on first launch. Once granted, it will begin detecting poses in real-time and display skeletal points and connections on the screen.

## Performance Considerations

- The app uses ML Kit's pose detection in stream mode for real-time processing
- Performance can be adjusted through the `performanceMode` option in the detection configuration
- Frame processing is optimized using worklets for better performance

## Acknowledgments

- [ML Kit](https://developers.google.com/ml-kit)
- [VisionCamera](https://mrousavy.com/react-native-vision-camera/)
- [React Native Skia](https://shopify.github.io/react-native-skia/)

## Support

If you encounter any issues or have questions, please file an issue in the GitHub repository.
```
