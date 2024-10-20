// App.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import RecordingButton from './components/RecordingButton';
import { startRecording, stopRecording, playSound } from './utils/audioController';

export default function App() {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>

      <RecordingButton
        isRecording={isRecording}
        onPress={isRecording 
          ? () => stopRecording(recording, setIsRecording, setRecording, setSound)
          : () => startRecording(setRecording, setIsRecording)
        }
      />

      {sound && (
        <TouchableOpacity
          onPress={() => playSound(sound)}
          style={{
            padding: 10,
            backgroundColor: '#00C851',
            borderRadius: 5,
            marginTop: 20,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Play Sound</Text>
        </TouchableOpacity>
      )}

      <StatusBar style="auto" />
    </View>
  );
}
