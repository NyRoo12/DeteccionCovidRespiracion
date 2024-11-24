import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import RecordingButton from './components/RecordingButton';
import { startRecording, stopRecording, playSound } from './utils/audioController';
import { FontAwesome } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient';
import { fetchSpectrogram } from './components/Spectrogram'; // Importa la función desde Spectrogram.js

export default function App() {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUri, setAudioUri] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setSound(null);
    setAudioUri(null);
  };

  return (
    <LinearGradient
      className="flex-1 justify-center items-center pt-4"
      colors={['#FFFFFF', '#65E9F5']}
      start={{ x: 0, y: 0.9 }}
    >
      <View className="mb-4">
        <Text className="text-2xl font-bold text-black">
          {formatTime(recordingTime)}
        </Text>
      </View>

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

      {audioUri && !loading && (
        <TouchableOpacity
          onPress={() => fetchSpectrogram(audioUri, setLoading)} // Usa la función importada
          className="p-4 bg-yellow-500 rounded-lg w-48 flex items-center absolute bottom-10"
        >
          <Text className="text-lg font-semibold text-white">Analizar Audio</Text>
        </TouchableOpacity>
      )}

      {loading && <ActivityIndicator size="large" color="#0000ff" className="absolute bottom-10" />}
      
      <StatusBar style="auto" />
    </LinearGradient>
  );
}
