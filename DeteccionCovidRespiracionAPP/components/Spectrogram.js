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
    const response = await axios.post('http://192.168.1.154:5000/analizar_audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const { confianza, mensaje } = response.data;
    return { confianza, mensaje }; // Devuelve los datos
  } catch (error) {
    console.error("Error al generar el espectrograma:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};