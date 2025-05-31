import ExposureControls from "@/components/ExposureControls";
import ReusableButton from "@/components/ReusableButton";
import { ThemedText } from "@/components/ThemedText";
import ZoomControls from "@/components/ZoomControls";
import { Colors } from "@/constants/Colors";
import { FontAwesome5 } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Redirect, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";

const HomeScreen = () => {
  const { hasPermission } = useCameraPermission();
  const microphonePermission = Camera.getMicrophonePermissionStatus();
  const redirectToPermissions =
    !hasPermission || microphonePermission === "not-determined";
  const [cameraPosition, setCameraPosition] = useState<"front" | "back">(
    "back"
  );
  const device = useCameraDevice(cameraPosition);
  const camera = useRef<Camera>(null);
  const router = useRouter();

  const [zoom, setZoom] = useState(device?.neutralZoom);
  const [exposure, setExposure] = useState(0);
  const [flash, setFlash] = useState<"off" | "on">("off");
  const [torch, setTorch] = useState<"off" | "on">("off");
  const [showZoomControls, setShowZoomControls] = useState(false);
  const [showExposureControls, setShowExposureControls] = useState(false);

  const takePicture = async () => {
    if (!device) return;

    try {
      if (camera.current == null) throw new Error("Camera is not connected!");
      console.log("Taking Picture");
      const photo = await camera.current.takePhoto({
        flash: flash,
        enableShutterSound: true,
      });

      router.push({
        pathname: "/media",
        params: { media: photo.path, type: "photo" },
      });
    } catch (e) {
      console.log(e);
    }
  };

  if (redirectToPermissions) return <Redirect href="/permissions" />;
  if (!device)
    return (
      <>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ThemedText style={{ textAlign: "center", fontSize: 25 }}>
            Camera is not available!
          </ThemedText>
          <TouchableOpacity
            // onPress={() => router.reload()}
            style={[
              styles.restartButton,
              {
                backgroundColor: Colors.dark.background,
                borderRadius: 6,
                alignSelf: "center",
              },
            ]}
          >
            <ThemedText>Restart App!</ThemedText>
          </TouchableOpacity>
        </View>
      </>
    );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 2, borderRadius: 10, overflow: "hidden" }}>
          <Camera
            ref={camera}
            style={{ flex: 1 }}
            device={device}
            photo={true}
            isActive
            zoom={zoom}
            exposure={exposure}
            // resizeMode="contain"
            torch={torch}
          />
          <BlurView
            intensity={100}
            tint="dark"
            style={{
              flex: 1,
              position: "absolute",
              bottom: 0,
              right: 0,
              padding: 10,
            }}
            experimentalBlurMethod="dimezisBlurView"
          >
            <ThemedText>
              Exposure: {exposure} | Zoom: x{zoom}
            </ThemedText>
          </BlurView>
        </View>

        {showZoomControls ? (
          <ZoomControls
            setZoom={setZoom}
            setShowZoomControls={setShowZoomControls}
            zoom={zoom ?? 1}
          />
        ) : showExposureControls ? (
          <ExposureControls
            setExposure={setExposure}
            setShowExposureControls={setShowExposureControls}
            exposure={exposure}
          />
        ) : (
          <View style={{ flex: 1 }}>
            {/* View Section */}
            <View style={{ flex: 0.7 }}>
              <ThemedText>Max FPS: {device.formats[0].maxFps}</ThemedText>
              <ThemedText>
                Width: {device.formats[0].photoWidth}
                Height: {device.formats[0].photoHeight}
              </ThemedText>
              <ThemedText>Camera: {device.name}</ThemedText>
            </View>

            {/* Controls Section */}
            <View
              style={{
                flex: 0.7,
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <ReusableButton
                onPress={() =>
                  setTorch((prev) => (prev === "off" ? "on" : "off"))
                }
                iconName={torch === "on" ? "flashlight" : "flashlight-outline"}
                containerStyle={{ alignSelf: "center" }}
              />
              <ReusableButton
                iconName={
                  flash === "on" ? "flash-outline" : "flash-off-outline"
                }
                onPress={() => setFlash((f) => (f === "off" ? "on" : "off"))}
                containerStyle={{ alignSelf: "center" }}
              />
              <ReusableButton
                iconName="camera-reverse-outline"
                onPress={() =>
                  setCameraPosition((p) => (p === "back" ? "front" : "back"))
                }
                containerStyle={{ alignSelf: "center" }}
              />
              <ReusableButton
                iconName="image-outline"
                onPress={() => {
                  const link = Platform.select({
                    ios: "photos-redirect://",
                    android: "content://media/external/images/media",
                  });
                  Linking.openURL(link!);
                }}
                containerStyle={{ alignSelf: "center" }}
              />
              <ReusableButton
                iconName="settings-outline"
                onPress={() => router.push("/_sitemap")}
                containerStyle={{ alignSelf: "center" }}
              />
            </View>

            {/* Capture Section */}
            <View
              style={{
                flex: 1.1,
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <ReusableButton
                iconSize={40}
                title="+/-"
                onPress={() => setShowZoomControls((s) => !s)}
                containerStyle={{ alignSelf: "center" }}
              />
              <TouchableHighlight onPress={takePicture}>
                <FontAwesome5 name="dot-circle" size={60} color="white" />
              </TouchableHighlight>
              <ReusableButton
                iconSize={40}
                title="1x"
                onPress={() => setShowExposureControls((s) => !s)}
                containerStyle={{ alignSelf: "center" }}
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  restartButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 25,
  },
  // restartButton: {
  //   padding: 10,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   backgroundColor: "#eaeaea",

  // }
});

export default HomeScreen;
