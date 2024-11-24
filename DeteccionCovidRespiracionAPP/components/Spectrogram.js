import axios from 'axios';
import { Alert } from 'react-native';

/**
 * Función para generar un espectrograma a partir del URI del audio.
 * @param {string} audioUri - URI del archivo de audio.
 * @param {function} setLoading - Función para manejar el estado de carga.
 */
export const fetchSpectrogram = async (audioUri, setLoading) => {
  setLoading(true);
  const formData = new FormData();

  formData.append('file', {
    uri: audioUri,
    type: "audio/m4a",
    name: "recording.m4a",
  });

  try {
    await axios.post('http://192.168.1.100:5000/analizar_audio', formData, {
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
