// RecordingButton.js
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function RecordingButton({ isRecording, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ alignItems: 'center' }}>
      <LinearGradient
        // Cambiamos los colores según si está grabando o no
        colors={isRecording ? ['#FF4E50', '#FF0000'] : ['#89CFF0', '#00BFFF']}
        style={{
          width: 100,
          height: 100,
          borderRadius: 50, // Para que sea un círculo
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          {isRecording ? 'Recording...' : 'Record'}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
