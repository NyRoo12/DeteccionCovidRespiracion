// app.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import RecordingButton from './components/RecordingButton';
import { startRecording, stopRecording, playSound } from './utils/audioController';
import { FontAwesome } from '@expo/vector-icons'; 
import Spectrogram from './components/Spectrogram';
import { LinearGradient } from 'expo-linear-gradient'; 

export default function App() {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUri, setAudioUri] = useState(null);
  const [showSpectrogram, setShowSpectrogram] = useState(false);

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

  const handleDelete = () => {
    // Implementa la lógica para eliminar el audio aquí
    setSound(null);
    setAudioUri(null);
  };

  return (
    <LinearGradient
      className="flex-1 justify-center items-center pt-4"
      colors={['#FFFFFF', '#65E9F5']}
      start={{ x: 0, y: 0.9 }}
    >
      {/* Contenedor para el contador de tiempo */}
      <View className="mb-4">
        <Text className="text-2xl font-bold text-black">
          {formatTime(recordingTime)}
        </Text>
      </View>

      {/* Contenedor para los círculos de fondo */}
      <View className="absolute top-20">
        {/* Círculos de fondo con relleno de color y opacidad */}
        <View
          className="absolute rounded-full"
          style={{
            width: 320,
            height: 320,
            borderRadius: 160,
            backgroundColor: isRecording ? 'rgba(255, 78, 78, 0.2)' : 'rgba(0, 184, 255, 0.2)',
            top: -30,
            left: -160,
            opacity: 0.3,
          }}
        />
        <View
          className="absolute rounded-full"
          style={{
            width: 290,
            height: 290,
            borderRadius: 145,
            backgroundColor: isRecording ? 'rgba(255, 78, 78, 0.4)' : 'rgba(0, 184, 255, 0.4)',
            top: -20,
            left: -145,
            opacity: 0.5,
          }}
        />
        <View
          className="absolute rounded-full"
          style={{
            width: 270,
            height: 270,
            borderRadius: 130,
            backgroundColor: isRecording ? 'rgba(255, 78, 78, 0.6)' : 'rgba(0, 184, 255, 0.6)',
            top: -10,
            left: -135,
            opacity: 0.8,
          }}
        />
      </View>

      {/* Contenedor para el botón de grabación */}
      <View className="absolute top-20">
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
      </View>

      {/* Contenedor para botones de control de audio */}
      <View className="absolute bottom-32 flex-row justify-between w-full px-10">
        {sound && (
          <>
            <TouchableOpacity
              onPress={() => playSound(sound)}
              className="p-4 bg-green-500 rounded-full w-20 h-20 flex justify-center items-center"
            >
              <FontAwesome name="play" size={32} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              className="p-4 bg-red-500 rounded-full w-20 h-20 flex justify-center items-center ml-4"
            >
              <FontAwesome name="trash" size={32} color="white" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Botón para analizar el audio solo si hay un audio para analizar */}
      {audioUri && (
        <TouchableOpacity
          onPress={() => setShowSpectrogram(true)}
          className="p-4 bg-yellow-500 rounded-lg w-48 flex items-center absolute bottom-10"
        >
          <Text className="text-lg font-semibold text-white">Analizar Audio</Text>
        </TouchableOpacity>
      )}

      {showSpectrogram && audioUri && (
        <Spectrogram audioUri={audioUri} />
      )}
    
      <StatusBar style="auto" />
    </LinearGradient>
  );
}
