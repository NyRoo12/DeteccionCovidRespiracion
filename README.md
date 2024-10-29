# Procesamiento de Datos de Sonidos Respiratorios (audio_espectrograma)

Este notebook, `audio_espectrograma.ipynb`, forma parte de un proyecto de análisis de datos de sonidos respiratorios. Procesa y prepara un conjunto de datos para su análisis, específicamente para clasificar el estado de COVID de los individuos en función de los sonidos respiratorios capturados.

## Descripción

Este notebook realiza las siguientes tareas:

1. **Carga de Datos**: Importa el archivo CSV de metadatos, que contiene información de los individuos y la ubicación de los archivos de sonido.
2. **Filtrado de Información**: Reduce el conjunto de datos a las columnas relevantes, tales como el ID del usuario, la edad, género, estado de COVID y la categoría de grabación `counting-fast`.
3. **Mapeo de Etiquetas de COVID**: Convierte el estado de COVID a una representación binaria:
   - `0`: Persona sin COVID o recuperada.
   - `1`: Persona con COVID positivo o síntomas.
4. **Exportación de Datos**: Guarda los datos procesados en un nuevo archivo CSV llamado `nuevo_dataset.csv`.

## Dependencias
- librosa: Para cargar y manipualr archivos de audio
- librosa.display: Para visualizar espectrogramas
- numpy: Para operaciones numericas
- os: Para manejar archivos
- Python 3.10
- pandas: Para manipulación y procesamiento de datos.

## Uso

1. Asegúrese de tener el archivo CSV con los metadatos en la ruta correcta (`CoronaHack-Respiratory-Sound-Dataset/Corona-Hack-Respiratory-Sound-Metadata.csv`).
2. Ejecute cada celda del notebook para:
   - Cargar y mostrar los datos iniciales.
   - Filtrar columnas innecesarias.
   - Mapear las etiquetas de estado de COVID.
   - Guardar el conjunto de datos filtrado en `nuevo_dataset.csv`.

## Notas

- Modifique `output_csv_path` si desea guardar el archivo final en una ubicación diferente.


# Clasificación de Espectrogramas de Sonidos Respiratorios para Detección de COVID-19 (Modelo CNNs)

Este proyecto desarrolla un modelo de clasificación binaria utilizando la red neuronal preentrenada VGG16. El objetivo es identificar, a partir de espectrogramas de sonidos respiratorios, si un caso es positivo o negativo para COVID-19. 

## Descripción del Proyecto
Este proyecto implementa una arquitectura de red neuronal profunda para clasificar imágenes de espectrogramas mediante la red VGG16, la cual fue entrenada previamente con el conjunto de datos ImageNet. La red ha sido ajustada para permitir una clasificación específica usando un conjunto de datos personalizado de espectrogramas de sonidos respiratorios.

## Estructura del Código
### 1. Preparación de los Datos
- **Preprocesamiento**: Se redimensionan las imágenes a 128x128 píxeles y se organizan en lotes de 32 imágenes.
- **Generación de Datos**: Se crea un generador de datos de entrenamiento y validación utilizando `ImageDataGenerator` para realizar aumentación (rotaciones, desplazamientos, volteo horizontal) y normalización de imágenes. El conjunto de datos se divide en un 80% para entrenamiento y un 20% para validación.

### 2. Creación del Modelo
- **Arquitectura**: Se usa VGG16 con sus capas preentrenadas congeladas y se añaden capas personalizadas: una capa de aplanado, una capa densa con activación ReLU, y una capa de salida con activación sigmoide.
- **Compilación**: El modelo se compila con la función de pérdida `binary_crossentropy`, el optimizador `Adam`, y las métricas de precisión y sensibilidad.

### 3. Entrenamiento del Modelo
- **Callback de Aprendizaje**: Se utiliza `ReduceLROnPlateau` para reducir la tasa de aprendizaje si no se observa mejora en la función de pérdida de validación.
- **Épocas y Resultados**: El modelo se entrena durante 5 épocas, con resultados de precisión de entrenamiento y validación monitoreados para detectar posibles problemas de sobreajuste.

### 4. Análisis de Resultados
Al finalizar el entrenamiento, el modelo alcanzó una alta precisión en el conjunto de entrenamiento y una buena precisión en validación, aunque se observan signos de posible sobreajuste. Se sugiere continuar ajustando el modelo o implementar regularización adicional.

## Requisitos
- **Librerías**: 
  - `TensorFlow` y `Keras` para la construcción y entrenamiento del modelo.
  - `Pandas`, `Numpy` y otras librerías auxiliares para manipulación de datos y visualización.

## Ejecución
Para ejecutar este código:
1. Configura las rutas y parámetros en `get_parameters()`.
2. Ejecuta el código para preparar los datos, compilar el modelo y entrenarlo en el conjunto de datos.

## Autores

- Nicolas Donoso
- Ivan Pizarro
- Benjamin Cea
- Vicente Muñoz
