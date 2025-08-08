# Juez-GPT

# 🤸‍♂️ Contador de Sentadillas con TensorFlow.js

Este proyecto es una aplicación web desarrollada con React y TensorFlow.js que utiliza la cámara del dispositivo para detectar sentadillas en tiempo real. Muestra visualmente los puntos clave del cuerpo, el esqueleto y un contador de repeticiones válido.

---

## 🚀 Características

- Detección de poses usando el modelo **MoveNet (Lightning)**
- Visualización en tiempo real de puntos y esqueleto sobre el video
- Cálculo del ángulo de la pierna para validar sentadillas
- Contador automático de repeticiones válidas
- Compatible con desktop y dispositivos móviles
- Soporte para modo oscuro 🌙

---

## 🧠 Tecnologías usadas

- [React](https://react.dev/)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [@tensorflow-models/pose-detection](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection)
- [Vite](https://vitejs.dev/)
- [react-webcam](https://www.npmjs.com/package/react-webcam)

---

## 🖥️ Instalación

1. Cloná el repositorio:

git clone https://github.com/Facucajal/Juez-GPT.git
cd nombre-del-repo

2. Instalá dependencias:

npm install

3. Ejecutá el proyecto en modo desarrollo:

npm run dev

4. Abrí en tu navegador: http://localhost:5173

---

## 📱 Uso
Aceptá los permisos de cámara.

Realizá una sentadilla delante del dispositivo.

El contador se incrementará cuando el ángulo de la pierna pase de arriba (ángulo > 160°) a abajo (ángulo < 90°) y vuelva.

## 📂 Estructura recomendada
```bash
Copy
Edit
src/
├── components/
│   └── CameraView.jsx
├── exercises/
│   └── squat.js
├── styles/
│   └── styles.scss
├── App.jsx
└── main.jsx
