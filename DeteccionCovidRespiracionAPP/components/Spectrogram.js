import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const Spectrogram = ({ audioUri }) => {
  const [loading, setLoading] = useState(false);

  const fetchSpectrogram = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', {
      uri: audioUri,
      type: "audio/m4a",
      name: "recording.m4a",
    });

    try {
      await axios.post('http://192.168.1.100:5000/generar_espectrograma', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert("Éxito", "El espectrograma ha sido generado.");
    } catch (error) {
      console.error("Error al generar el espectrograma:", error);
      Alert.alert("Error", "No se pudo generar el espectrograma. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#f3f3f3' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Espectrograma</Text>
      <TouchableOpacity onPress={fetchSpectrogram} style={{ backgroundColor: '#007bff', padding: 10, borderRadius: 8 }}>
        <Text style={{ color: 'white' }}>Generar Espectrograma</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

export default Spectrogram;
