import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import RecordingButton from './components/RecordingButton';
import { startRecording, stopRecording, playSound } from './utils/audioController';
import { FontAwesome } from '@expo/vector-icons'; 
import Spectrogram from './components/Spectrogram';  // Importa el componente del espectrograma

export default function App() {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUri, setAudioUri] = useState(null);
  const [showSpectrogram, setShowSpectrogram] = useState(false); // Para controlar cuándo mostrar el espectrograma

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isRecording && recordingTime !== 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      {isRecording && (
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
          {formatTime(recordingTime)}
        </Text>
      )}

      <RecordingButton
        isRecording={isRecording}
        onPress={
          isRecording
            ? () => {
                if (recording) {
                  stopRecording(recording, setIsRecording, setRecording, setSound, setAudioUri);
                  setRecordingTime(0);
                }
              }
            : () => {
                startRecording(setRecording, setIsRecording);
                setRecordingTime(0);
              }
        }
      />

      {sound && (
        <TouchableOpacity
          onPress={() => playSound(sound)}
          style={{
            padding: 10,
            backgroundColor: '#00C851',
            borderRadius: 50,
            marginTop: 20,
            width: 70,
            height: 70,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FontAwesome name="play" size={32} color="white" />
        </TouchableOpacity>
      )}

      {/* Botón para analizar el audio */}
      <TouchableOpacity
        onPress={() => setShowSpectrogram(true)} // Mostrar el espectrograma
        style={{
          padding: 15,
          backgroundColor: '#ffbb33',
          borderRadius: 10,
          marginTop: 20,
          width: 200,
          alignItems: 'center',
        }}
      >
        <Text >Analizar Audio</Text>
      </TouchableOpacity>

      {showSpectrogram && audioUri && (
        <Spectrogram audioUri={audioUri} /> // Mostrar el espectrograma si se analiza el audio
      )}

      <StatusBar style="auto" />
    </View>
  );
}
