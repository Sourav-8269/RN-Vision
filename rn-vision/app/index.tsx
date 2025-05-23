import { ThemedText } from "@/components/ThemedText";
import { Redirect, useRouter } from "expo-router";
import { Platform, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";

const HomeScreen = () => {
  const { hasPermission } = useCameraPermission();
  const microphonePermission = Camera.getMicrophonePermissionStatus();
  const redirectToPermissions = !hasPermission || microphonePermission === "not-determined";
  const device = useCameraDevice("back");
  const router = useRouter();

  if(redirectToPermissions) return <Redirect href="/permissions" />
  if(!device) return <ThemedText>Camera is not available!</ThemedText>

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Camera style={{ flex:1 }} device={device} isActive />
        <ThemedText>Hello World!</ThemedText>
        <TouchableOpacity style={{ backgroundColor: "red", padding: 10, marginTop: 50 }}>
          <ThemedText onPress={() => console.log("Hello")}>Press me 2</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  }
})

export default HomeScreen;
