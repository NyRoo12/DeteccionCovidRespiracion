import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ResultModal = ({ visible, onClose, confianza, mensaje }) => {
  // Función para calcular el color según el porcentaje de confianza
  const getColor = (value) => {
    const red = Math.round(255 - (value * 2.55));
    const green = Math.round(value * 2.55);
    return `rgb(${red},${green},0)`;
  };

  // Texto dinámico basado en el porcentaje de confianza
  const getMessage = (value) => {
    if (value > 75) return "Confianza Alta - Probabilidad de COVID es baja.";
    if (value > 50) return "Confianza Media - Los resultados son inciertos.";
    return "Confianza Baja - Alta probabilidad de COVID.";
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        {/* Cuadro principal */}
        <View className="w-4/5 bg-white rounded-lg p-6 shadow-lg">
          <Text className="text-lg font-bold mb-4 text-center">
            Resultado del Análisis
          </Text>

          {/* Mensaje del análisis */}
          <Text className="text-center text-gray-700 mb-4">{mensaje}</Text>

          {/* Barra de confianza */}
          <View className="relative w-full h-8 bg-gray-300 rounded-full overflow-hidden mb-6">
            {/* Progreso de la barra */}
            <View
              style={{
                width: `${confianza}%`,
                backgroundColor: getColor(confianza),
              }}
              className="absolute h-full"
            />
            {/* Flechita indicando el porcentaje */}
            <View
              style={{
                position: 'absolute',
                left: `${confianza - 5}%`,
              }}
              className="flex items-center justify-center"
            >
              <FontAwesome name="caret-up" size={24} color="black" />
              <Text className="text-xs font-semibold">{`${confianza.toFixed(1)}%`}</Text>
            </View>
          </View>

          {/* Mensaje dinámico */}
          <Text className="text-center text-lg font-semibold mb-4">
            {getMessage(confianza)}
          </Text>

          {/* Botón para cerrar */}
          <TouchableOpacity
            onPress={onClose}
            className="p-3 bg-blue-500 rounded-lg"
          >
            <Text className="text-white text-center font-bold">Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ResultModal;
