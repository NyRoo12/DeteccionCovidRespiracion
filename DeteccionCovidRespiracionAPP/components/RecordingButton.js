//RecordingButton.js

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons'; // Importamos el icono de micrófono

export default function RecordingButton({ isRecording, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ alignItems: 'center' }}>
      <LinearGradient
        // Cambiamos los colores según si está grabando o no
        colors={isRecording ? ['#FF4E50', '#FF0000'] : ['#89CFF0', '#00BFFF']}
        style={{
          width: 250, // Aumentamos el tamaño del botón
          height: 250, // Aumentamos el tamaño del botón
          borderRadius: 200, // Para que siga siendo un círculo
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FontAwesome 
          name="microphone" // Usamos el ícono de micrófono
          size={100} // Tamaño del ícono
          color="white" // Color del ícono
        />
      </LinearGradient>
    </TouchableOpacity>
  );
}
