const fs = require("fs");
const path = require("path");

const filePath = path.resolve(
  __dirname,
  "../node_modules/react-native-vision-camera/src/skia/useSkiaFrameProcessor.ts"
);

try {
  // Read the file content
  let fileContent = fs.readFileSync(filePath, "utf8");

  // Update the 'landscape-left' case with canvas.scale(1, -1)
  const pattern = `case 'landscape-left':\\s*// rotate two flips on \\(0,0\\) origin and move X \\+ Y into view again\\s*canvas.translate\\(frame.height, frame.width\\)\\s*canvas.rotate\\(270, 0, 0\\)`;
  const replacement = `$&\n        canvas.scale(1, -1)`;
  fileContent = fileContent.replace(new RegExp(pattern, "g"), replacement);

  // Write the updated content back to the file
  fs.writeFileSync(filePath, fileContent, "utf8");
  console.log(
    "Updated useSkiaFrameProcessor.ts to fix android front camera black screen issue"
  );
} catch (error) {
  console.error("Failed to modify useSkiaFrameProcessor.ts:", error);
}
