# EcoMar — primera versión

Prototipo educativo para Android e iOS, construido con Expo SDK 57, Expo Router y ViroReact 2.57.3.

## Funciones

- Contenido educativo del arrecife y cinco organismos conceptuales.
- Detección y selección de superficies horizontales.
- Escena 3D construida con geometría local, sin descargas de modelos.
- Selección de organismos, tamaño ajustable y recolocación.
- Resaltado de participantes de depredación, competencia y mutualismo.
- Comprobación de soporte RA y permiso de cámara.

Las formas son esquemáticas y no representan anatomía ni escala biológica. Las microalgas se muestran fuera del coral para facilitar su selección, aunque viven asociadas a sus tejidos. Contenido pendiente de validación docente. No hay animaciones, evaluación ni persistencia todavía.

## Desarrollo

```sh
npm install
npm start
```

La RA requiere instalar una compilación propia de EcoMar. Expo Go solo permite consultar las pantallas educativas. No se usan anclajes en la nube ni claves de ReactVision.

### Android local

Con Android Studio, SDK Android, Java y un dispositivo físico compatible con ARCore:

```sh
npm run android -- --device
```

### iOS local

En macOS con Xcode y firma configurada, usando un iPhone compatible con ARKit:

```sh
npm run ios -- --device
```

### Compilaciones con EAS

El archivo eas.json contiene perfiles development, preview y production. Para compilar desde Windows se necesita una cuenta Expo; instalar en un iPhone mediante distribución interna requiere credenciales Apple adecuadas y registro del dispositivo.

```sh
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile development
npx eas-cli@latest build --platform ios --profile development
```

No se ha ejecutado ninguna compilación EAS ni verificado la RA en dispositivos físicos.

## Verificación

```sh
npm run typecheck
npm run lint
npx expo install --check
```

Prueba física pendiente en Android e iOS: permiso concedido/rechazado, detección de mesa, colocación estable, selección, resaltado, ajuste de tamaño, recolocación y salida del visor. Comprobar también el mensaje en dispositivos sin soporte RA.

Repositorio: https://github.com/PMcodingec/Ecomar

## Mejora del arrecife

La escena utiliza corales ramificados, algas con hojas, peces con ojos y aletas, grupos de microalgas y rocas. Las interacciones unen sus participantes con una línea sin dirección, conservando sus colores. Controles de giro y etiquetas, y marcador de selección. Los modelos son geométricos y educativos, no reproducciones anatómicas. Las microalgas se muestran ampliadas fuera del coral para permitir seleccionarlas.

Para ver estos cambios en un APK preview es necesario generar otra compilación. En una compilación de desarrollo ya instalada, se pueden cargar con `npm start`. Validación física Android/iOS pendiente.

## Bienvenida del primer ingreso

Tres pasos ilustrados explican EcoMar, las interacciones marinas y cómo permitir la cámara y colocar el arrecife. El permiso se solicita únicamente al pulsar el botón y puede dejarse para el visor RA. Al finalizar, se guarda una marca local con AsyncStorage; no se repite en el siguiente inicio. Puede revisarse desde "Ver guía de bienvenida". Borrar los datos o reinstalar reinicia la bienvenida.

La dependencia AsyncStorage requiere una nueva compilación si no estaba incluida en la aplicación de desarrollo instalada. Verificar en dispositivo: primer inicio, reinicio posterior, denegación de cámara, permiso desde ajustes y revisión de guía.
