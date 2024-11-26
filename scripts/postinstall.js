/**
 * @file postinstall.js
 * @author Danor S.O.D.A
 * @lastEdited 25-11-2024
 *
 * @description
 * Post-installation script that patches the Vision Camera's useSkiaFrameProcessor.ts file
 * to fix the Android front camera black screen issue.
 * it runs automatically after the installation of the dependencies.
 * This script adds a canvas scale transformation for the landscape-left orientation.
 *
 * The script:
 * - Locates the target file in node_modules
 * - Checks if the patch has already been applied
 * - Adds the necessary canvas.scale(1, -1) transformation
 * - Preserves the original file if modification fails
 */

const fs = require("fs");
const path = require("path");

// Define the target file path
const filePath = path.resolve(
  __dirname,
  "../node_modules/react-native-vision-camera/src/skia/useSkiaFrameProcessor.ts"
);

/**
 * Patch the useSkiaFrameProcessor.ts file
 * Adds canvas.scale(1, -1) to fix Android front camera orientation
 */
try {
  // Read the file content
  let fileContent = fs.readFileSync(filePath, "utf8");

  // Check if patch already exists
  if (fileContent.includes("canvas.scale(1, -1)")) {
    console.log("Patch already applied to useSkiaFrameProcessor.ts");
    process.exit(0);
  }

  // Define the pattern to match and the replacement
  const pattern = `case 'landscape-left':\\s*// rotate two flips on \\(0,0\\) origin and move X \\+ Y into view again\\s*canvas.translate\\(frame.height, frame.width\\)\\s*canvas.rotate\\(270, 0, 0\\)`;
  const replacement = `$&\n        canvas.scale(1, -1)`;

  // Apply the patch
  const updatedContent = fileContent.replace(
    new RegExp(pattern, "g"),
    replacement
  );

  // Verify that the content was actually modified
  if (fileContent === updatedContent) {
    console.warn(
      "No changes were made to useSkiaFrameProcessor.ts - pattern not found"
    );
    process.exit(1);
  }

  // Write the updated content back to the file
  fs.writeFileSync(filePath, updatedContent, "utf8");
  console.log(
    "Successfully updated useSkiaFrameProcessor.ts to fix Android front camera black screen issue"
  );
} catch (error) {
  console.error("Failed to modify useSkiaFrameProcessor.ts:", error);
  process.exit(1);
}
