// Spectrogram.js
import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { Audio } from 'expo-av'; // Asegúrate de que esta importación esté aquí
import { LineChart } from 'react-native-chart-kit'; // O cualquier biblioteca que estés usando para el espectrograma

const Spectrogram = ({ audioUri }) => {
  const sound = useRef(null);

  useEffect(() => {
    const loadSound = async () => {
      if (audioUri) {
        const { sound: playbackObject } = await Audio.Sound.createAsync(
          { uri: audioUri }
        );
        sound.current = playbackObject;

        playbackObject.setOnPlaybackStatusUpdate(status => {
          if (status.didJustFinish) {
            playbackObject.unloadAsync();
          }
        });
      }
    };

    loadSound();

    return () => {
      if (sound.current) {
        sound.current.unloadAsync();
      }
    };
  }, [audioUri]);

  return (
    <View className="flex-1 justify-center items-center p-4 bg-gray-100">
      <Text className="text-xl font-bold mb-4">Espectrograma</Text>
      {/* Aquí puedes renderizar el gráfico del espectrograma */}
      <LineChart
        data={{
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
          datasets: [
            {
              data: [20, 45, 28, 80],
            },
          ],
        }}
        width={400} // Ancho del gráfico
        height={220} // Alto del gráfico
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2, // Opcional, por defecto es 2
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

export default Spectrogram;
