import { NavigationContainer } from "@react-navigation/native";
import PoseDetectionScreen from "./src/PoseDetectionScreen";

export default function App() {
  return (
    <NavigationContainer>
      <PoseDetectionScreen />
    </NavigationContainer>
  );
}
