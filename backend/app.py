import os
import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np
from pydub import AudioSegment
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import tensorflow as tf
from PIL import Image
import matplotlib
matplotlib.use('Agg')

app = Flask(__name__)

# Cargar el modelo preentrenado
MODEL_PATH = "my_model.keras"  # Ruta del modelo
model = load_model(MODEL_PATH)
print(model.summary())


# Función para convertir el archivo de audio a .wav usando pydub
def convertir_a_wav(archivo_audio):
    audio = AudioSegment.from_file(archivo_audio)
    archivo_wav = "audio_convertido.wav"
    audio.export(archivo_wav, format="wav")
    return archivo_wav

# Función para preprocesar el espectrograma para el modelo
def preprocess_spectrogram(image_path):
    input_shape = model.input_shape[1:3]  # Obtener tamaño de la entrada del modelo
    image = Image.open(image_path).convert("RGB")  # Convertir a RGB
    image = image.resize((128,128))  # Ajustar tamaño al esperado por el modelo
    image_array = np.array(image) / 255.0  # Normalizar a [0, 1]
    return np.expand_dims(image_array, axis=0)  # Expandir dimensión para batch

# Ruta para generar y analizar espectrograma
@app.route("/analizar_audio", methods=["POST"])
def analizar_audio():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    archivo_audio = "audio_subido"
    file.save(archivo_audio)

    try:
        # Convertir el archivo de audio a WAV
        archivo_wav = convertir_a_wav(archivo_audio)

        # Generar espectrograma
        espectrograma_path = "espectrograma.png"
        generar_espectrograma_segmentado("audio_convertido.wav", espectrograma_path)

        # Preprocesar el espectrograma
        spectrogram_data = preprocess_spectrogram(espectrograma_path)

        # Realizar predicción con el mode
        prediction = model.predict(spectrogram_data)
        probability = prediction[0][0]
        optimal_threshold = 0.6154 # Ajusta este valor si tienes un umbral óptimo
        predicted_class = int(probability >= optimal_threshold)
        confidence = probability if predicted_class == 1 else 1 - probability

        # Eliminar archivos temporales
        os.remove(archivo_audio)
        os.remove(archivo_wav)

        # Devolver resultados
        print(predicted_class)
        resultado = "Tiene COVID" if predicted_class == 0 else "No tiene COVID"
        print(resultado) 
        print(confidence)
        return jsonify({
            "mensaje": resultado,
            "confianza": float(confidence)
        })
    except Exception as e:
        print("Error durante la predicción:", e)
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

def dividir_audio(y, sr, dur_segmento=2.5):
    segmentos = []
    dur_total = librosa.get_duration(y=y, sr=sr)
    for i in range(0, int(dur_total // dur_segmento)):
        start = int(i * dur_segmento * sr)
        end = int((i + 1) * dur_segmento * sr)
        segmentos.append(y[start:end])
    return segmentos

def generar_espectrograma_segmentado(audio_path, output_path):
    try:
        y, sr = librosa.load(audio_path, sr=None)  # Mantener la frecuencia de muestreo original
        segmentos = dividir_audio(y, sr)  # Dividir audio en segmentos

        # Crear figura para espectrograma segmentado
        plt.figure(figsize=(8, 4))
        is_valid_spectrogram = False  # Bandera para determinar si el espectrograma es válido
        
        for i, segmento in enumerate(segmentos):
            # Verificar que el segmento no esté vacío ni sea silencioso
            if np.max(np.abs(segmento)) < 1e-3:
                print(f"Segmento {i} silencioso, omitiendo...")
                continue
            
            # Normalizar el segmento
            segmento = segmento / np.max(np.abs(segmento)) if np.max(np.abs(segmento)) > 0 else segmento
            
            # Generar espectrograma para cada segmento
            S = librosa.feature.melspectrogram(y=segmento, sr=sr, n_mels=128, fmax=8000)
            S_dB = librosa.power_to_db(S, ref=np.max)
            S_dB = np.clip(S_dB, -80, 0)  # Limitar valores entre -80 dB y 0 dB
            
            # Validar si el espectrograma tiene suficiente variación
            if np.std(S_dB) < 1:  # Baja variación indica espectrograma inválido
                print(f"Segmento {i} tiene baja variación en el espectrograma, omitiendo...")
                continue

            is_valid_spectrogram = True  # Al menos un segmento es válido

            # Mostrar espectrograma en su posición
            plt.subplot(1, len(segmentos), i + 1)
            librosa.display.specshow(S_dB, sr=sr, x_axis=None, y_axis=None, cmap='jet')
            plt.axis('off')

        if not is_valid_spectrogram:
            print(f"Espectrograma no válido para archivo: {audio_path}")
            plt.close()
            return  # No guardar si ningún segmento es válido

        plt.tight_layout(pad=0)
        plt.savefig(output_path, bbox_inches='tight', pad_inches=0,dpi=300)
        plt.close()
    except Exception as e:
        print(f"Error procesando {audio_path}: {e}")

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
