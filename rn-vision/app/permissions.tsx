import { useState } from "react";
import { Camera, CameraPermissionStatus } from "react-native-vision-camera";
import * as ExpoMediaLibrary from "expo-media-library";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Alert,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ICON_SIZE = 26;

const PermissionsScreen = () => {
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");
  const [microphonePermissionStatus, setMicrophonePermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    ExpoMediaLibrary.usePermissions();

  const requestCameraPermission = async () => {
    const status = await Camera.requestCameraPermission();
    setCameraPermissionStatus(status);
  };

  const requestMicrophonePermission = async () => {
    const status = await Camera.requestMicrophonePermission();
    setMicrophonePermissionStatus(status);
  };

  const handleContinue = async () => {
    if (
      cameraPermissionStatus === "granted" &&
      microphonePermissionStatus === "granted" &&
      mediaLibraryPermission?.granted
    ) {
      router.replace("/");
    } else {
      Alert.alert("Please go to settings and enable permissions.");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: "Permissions" }} />
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Camera needs access to a few permissions in order to work correctly.
        </ThemedText>
        <View style={styles.row}>
          <Ionicons
            name="lock-closed-outline"
            color="orange"
            size={ICON_SIZE}
          />
          <ThemedText style={styles.footnote}>Required</ThemedText>
        </View>

        <View style={styles.spacer} />

        <View
          style={StyleSheet.compose(styles.row, styles.permissionContainer)}
        >
          <Ionicons name="camera-outline" color="gray" size={ICON_SIZE} />
          <View style={styles.permissionText}>
            <ThemedText>Camera</ThemedText>
            <ThemedText>Used for taking photos and videos</ThemedText>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "orange" }}
            value={cameraPermissionStatus === "granted"}
            onChange={requestCameraPermission}
          />
        </View>

        <View style={styles.spacer} />

        <View
          style={StyleSheet.compose(styles.row, styles.permissionContainer)}
        >
          <Ionicons name="mic-outline" color="gray" size={ICON_SIZE} />
          <View style={styles.permissionText}>
            <ThemedText>Microphone</ThemedText>
            <ThemedText>Used for recording video</ThemedText>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "orange" }}
            value={microphonePermissionStatus === "granted"}
            onChange={requestMicrophonePermission}
          />
        </View>

        <View style={styles.spacer} />

        <View
          style={StyleSheet.compose(styles.row, styles.permissionContainer)}
        >
          <Ionicons name="library-outline" color="gray" size={ICON_SIZE} />
          <View style={styles.permissionText}>
            <ThemedText>Library</ThemedText>
            <ThemedText>Used for saving, viewing and more</ThemedText>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "orange" }}
            value={mediaLibraryPermission?.granted}
            // @ts-ignore
            onChange={async () => await requestMediaLibraryPermission()}
          />
        </View>

        <View style={styles.spacer} />
        <View style={styles.spacer} />
        <View style={styles.spacer} />

        <TouchableOpacity
          onPress={handleContinue}
          style={StyleSheet.compose(styles.row, styles.continueButton)}
        >
          <Ionicons
            name="arrow-forward-outline"
            color="white"
            size={ICON_SIZE}
          />
        </TouchableOpacity>
      </ThemedView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 10,
  },
  footnote: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  spacer: {
    marginVertical: 6,
  },
  permissionContainer: {
    backgroundColor: "#ffffff20",
    borderRadius: 10,
    padding: 10,
    justifyContent: "space-between",
  },
  permissionText: {
    marginLeft: 10,
    flexShrink: 1,
    // borderColor: "gray",
    // borderWidth: 1,
    width: "100%",
  },
  continueButton: {
    padding: 10,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 50,
    alignSelf: "center",
  },
});

export default PermissionsScreen;
