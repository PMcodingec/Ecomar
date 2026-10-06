# EcoMar

Aplicación educativa para estudiantes de Biología: ecosistemas marinos y sus interacciones ecológicas, con una futura experiencia de realidad aumentada.

## Ejecutar en el teléfono

Requisitos: Node.js 22.13 o superior y Expo Go compatible con SDK 57.

```sh
npm install
npm start
```

Conecta el teléfono y la computadora a la misma red Wi-Fi y escanea el QR desde Expo Go (Android) o la cámara (iPhone).

## Estado

Base Expo SDK 57 con React Native y TypeScript. Incluye una pantalla inicial en español. Los módulos educativos, evaluaciones y realidad aumentada todavía no están implementados.

Expo Go permite probar esta base. Una futura integración con ARCore/ARKit mediante módulos nativos adicionales requerirá un development build.

## Validación

```sh
npx tsc --noEmit
npx expo lint
npx expo install --check
```

Repositorio: https://github.com/PMcodingec/Ecomar — rama main.

