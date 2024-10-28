import { Audio } from 'expo-av';

export async function startRecording(setRecording, setIsRecording) {
  try {
    console.log('Requesting permissions..');
    const permission = await Audio.requestPermissionsAsync();
    if (permission.status === 'granted') {
      console.log('Starting recording..');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      console.log('Recording started');
    } else {
      console.error('Permission not granted');
    }
  } catch (err) {
    console.error('Failed to start recording', err);
  }
}

export async function stopRecording(recording, setIsRecording, setRecording, setSound, setAudioUri) {
  if (!recording) {
    console.log('No recording found');
    return;
  }

  try {
    console.log('Stopping recording..');
    setIsRecording(false);
    await recording.stopAndUnloadAsync();

    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);

    setAudioUri(uri); // Guardar la URI del audio
    const { sound } = await recording.createNewLoadedSoundAsync();
    setSound(sound);
    setRecording(null); // Reset the recording state
  } catch (err) {
    console.error('Error stopping recording', err);
  }
}

export async function playSound(sound) {
  if (sound) {
    console.log('Playing sound');
    await sound.playAsync();
  }
}
