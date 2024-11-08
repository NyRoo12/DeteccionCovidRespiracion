import os
import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np
from pydub import AudioSegment
from flask import Flask, request, jsonify

app = Flask(__name__)

# Función para convertir el archivo de audio a .wav usando pydub
def convertir_a_wav(archivo_audio):
    # Cargar el archivo de audio (puede ser m4a, mp3, etc.)
    audio = AudioSegment.from_file(archivo_audio)
    
    # Crear un nombre para el archivo de salida
    archivo_wav = "audio_convertido.wav"
    
    # Convertir el archivo a formato WAV
    audio.export(archivo_wav, format="wav")
    
    return archivo_wav

# Función para generar el espectrograma sin ejes
def generar_espectrograma_sin_ejes(archivo_audio):
    # Cargar el archivo de audio WAV
    y, sr = librosa.load(archivo_audio)
    
    # Generar el espectrograma usando la transformada de Fourier de corto plazo (STFT)
    D = librosa.amplitude_to_db(np.abs(librosa.stft(y)), ref=np.max)
    
    # Crear el nombre del archivo de salida
    nombre_archivo_salida = "espectrograma_sin_ejes.png"
    
    # Graficar el espectrograma sin ejes ni etiquetas
    plt.figure(figsize=(10, 6))
    librosa.display.specshow(D, sr=sr, x_axis=None, y_axis=None, cmap='viridis')
    plt.axis('off')  # Quitar los ejes
    plt.savefig(nombre_archivo_salida, bbox_inches='tight', pad_inches=0)  # Guardar sin márgenes
    plt.close()
    
    return nombre_archivo_salida

# Ruta para generar el espectrograma
@app.route("/generar_espectrograma", methods=["POST"])
def generar_espectrograma():
    # Verificar que el archivo esté presente en la solicitud
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    # Si no se selecciona un archivo
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    # Guardar el archivo temporalmente
    archivo_audio = "audio_subido"  # Usamos un nombre temporal para el archivo
    file.save(archivo_audio)

    try:
        # Convertir el archivo de audio a WAV
        archivo_wav = convertir_a_wav(archivo_audio)
        
        # Generar el espectrograma
        archivo_salida = generar_espectrograma_sin_ejes(archivo_wav)
        
        # Eliminar archivos temporales
        os.remove(archivo_audio)
        os.remove(archivo_wav)
        
        return jsonify({"mensaje": "Espectrograma generado", "archivo": archivo_salida})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
