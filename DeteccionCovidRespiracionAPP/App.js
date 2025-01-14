import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Modal, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import RecordingButton from './components/RecordingButton';
import { startRecording, stopRecording, playSound } from './utils/audioController';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchSpectrogram } from './components/Spectrogram'; // Función para analizar audio

export default function App() {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUri, setAudioUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [resultado, setResultado] = useState({ confianza: 0, mensaje: '' });

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

  const handleAnalyzeAudio = async () => {
    setLoading(true);
    try {
      const { confianza, mensaje } = await fetchSpectrogram(audioUri, setLoading);
      setResultado({ confianza: confianza * 100, mensaje });
      setModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'No se pudo analizar el audio. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      className="flex-1 justify-center items-center pt-4"
      colors={['#FFFFFF', '#65E9F5']}
      start={{ x: 0, y: 0.9 }}
    >
      <View className="mb-4">
        <Text className="text-2xl font-bold text-black">{formatTime(recordingTime)}</Text>
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
          onPress={handleAnalyzeAudio}
          className="p-4 bg-yellow-500 rounded-lg w-48 flex items-center absolute bottom-10"
        >
          <Text className="text-lg font-semibold text-white">Analizar Audio</Text>
        </TouchableOpacity>
      )}

      {loading && <ActivityIndicator size="large" color="#0000ff" className="absolute bottom-10" />}

      <StatusBar style="auto" />

      {/* Modal de resultados */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Resultado del Análisis</Text>
            <View style={styles.progressBar}>
              <View
                style={{
                  ...styles.progressIndicator,
                  width: `${resultado.confianza}%`,
                  backgroundColor: resultado.confianza >= 50 ? 'green' : 'red',
                }}
              />
            </View>
            <Text style={styles.confidenceText}>
              Confianza: {resultado.confianza.toFixed(2)}%
            </Text>
            <Text style={styles.messageText}>{resultado.mensaje}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 20,
    backgroundColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progressIndicator: {
    height: '100%',
  },
  confidenceText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  messageText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
