//AudioController.js

import { Audio } from 'expo-av';

const recordingOptions = {
  android: {
    extension: '.wav',
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_LINEARPCM,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100, // Aumenta la frecuencia de muestreo
    numberOfChannels: 2, // Estéreo
    bitRate: 256000, // Bitrate más alto para mejor calidad
  },
  ios: {
    extension: '.wav',
    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
    sampleRate: 48000, // Aumenta la frecuencia de muestreo
    numberOfChannels: 1, // Estéreo
    bitRate: 256000, // Bitrate más alto
    linearPCMBitDepth: 24, // Profundidad de bits
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};


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

      const { recording } = await Audio.Recording.createAsync(recordingOptions);
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
