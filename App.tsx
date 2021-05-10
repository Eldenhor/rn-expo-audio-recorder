import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Card, Title } from "react-native-paper";
import { Audio } from "expo-av";
import { Sound } from "expo-av/build/Audio/Sound";
import { Recording } from "expo-av/build/Audio/Recording";

export default function App() {
  const [sound, setSound] = useState<Sound>();
  const [recording, setRecording] = useState<Recording>();
  const [recordUri, setRecordUri] = useState("");

  const onStartPlay = async () => {
    console.log("Loading sound");
    const {sound} = await Audio.Sound.createAsync(
      require("./assets/sounds/testSound.mp3")
    );
    setSound(sound);
    console.log("Playing sound");
    await sound.playAsync();
  };
  const onStopPlay = async () => {
    if (sound !== null) {
      await sound?.stopAsync();
    }
    console.log("Stop sound");
  };
  // wip, not working
  const onPausePlay = async () => {
    if (sound !== null) {
      await sound?.pauseAsync();
    }
    console.log("Pause sound, but can't unpause...");
  };


  const onStartRecord = async () => {
    try {
      console.log("Requesting permission...");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      });
      console.log("Starting recording...");
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      setRecording(recording);
      console.log("Record started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };
  const onStopRecord = async () => {
    console.log("Stopping recording...");
    setRecording(undefined);
    await recording?.stopAndUnloadAsync();
    const uri = recording?.getURI();
    setRecordUri(uri ? uri : "");
    console.log("Recording stopped and stored at", uri);
  };
  const onPlayRecord = async () => {
    console.log("Loading record");
    console.log(recordUri);
    const {sound} = await Audio.Sound.createAsync({uri: recordUri});
    setSound(sound);
    await sound?.playAsync();
  };

  useEffect(() => {
    return sound
      ? () => {
        console.log("Unloading sound");
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);


  return (
    <Card style={styles.card}>
      <Title>record time</Title>
      <Button mode="contained" icon="record" onPress={() => onStartRecord()}>
        RECORD
      </Button>
      <Button
        icon="stop"
        mode="outlined"
        onPress={() => onStopRecord()}
      >
        STOP
      </Button>
      <Button
        icon="stop"
        mode="outlined"
        onPress={() => onPlayRecord()}
      >
        PLAY RECORD
      </Button>

      <Title>play duration</Title>
      <Button mode="contained" icon="play" onPress={() => onStartPlay()}>
        PLAY
      </Button>

      <Button
        icon="pause"
        mode="contained"
        onPress={() => onPausePlay()}
      >
        PAUSE
      </Button>
      <Button
        icon="stop"
        mode="outlined"
        onPress={() => onStopPlay()}
      >
        STOP
      </Button>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    paddingHorizontal: 40,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
  }
});
