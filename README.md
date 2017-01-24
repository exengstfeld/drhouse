# DrHouse

Aplicación diseñada para marcar la entrada y salida de los prestadores o visitadores medicos. Permite realizar un seguimiento de la historia clinica, pedido de insumos y validar la geo localización del medico según el paciente.

# Introducción

Esta está desarrollada en JavaScript con [React](http://facebook.github.io/react/index.html) y JSX.
Al usar JSX no hay templates HTML y todo está inline en el JS y distribuido en **componentes**.

Usamos [Cordova](http://cordova.apache.org/) para homogeneizar la API JS y empaquetar
la app para cada plataforma, y browserify con npm para el manejo de modulos JS.

# Instalación 

Primero debemos instalar las librerias básicas necesarias, luego explicaremos la compilación y construcción del proyecto para una futura ejecución ya sea en el navegador o en Android.

## Nodejs y extras JS

Agregamos el ppa de Node:

```bash
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
```

Y ahora desde npm vamos a instalar browserify y react-tools:

```bash
sudo npm install -g browserify
sudo npm install -g react-tools
sudo npm install -g watchify
sudo npm install -g uglify-js
```

## Cordova

Instalamos la CLI tool de Cordoba:

```bash
sudo npm install -g cordova
```

y luego en el directorio del proyecto, instalamos las plataformas y los plugins (interfaces) necesarios:

```bash
cordova platform add android
cordova platform add browser
cordova plugin add phonegap-plugin-barcodescanner --variable CAMERA_USAGE_DESCRIPTION="To scan barcodes"
```

## Android SDK
(Para utilizar el simulador de Android). [Bajar la SDK](https://developer.android.com/sdk/installing/index.html?pkg=tools), descomprimirla y agregar los paths:

```
export ANDROID_SDK_PATH=<somewhere>/android-sdk-linux
export PATH=$PATH:$ANDROID_SDK_PATH/tools
export PATH=$PATH:$ANDROID_SDK_PATH/platform-tools
```
Luego, correr el comando `android` y desde la GUI instalar la **API 21**.

Final y opcionalmente, para emular un dispositivo debemos crearlo:

```
android create avd -n android21 -t 1 --abi armeabi-v7a
```

Nota: Para que `adb` vea el dispositivo hay que seguir esta guía: http://developer.android.com/tools/device.html 

# Building

En `www/` encontraremos el package.json con las librerias necesarias para el proyecto (NodeJS). Las instalamos mediante el siguiente comando:

```bash
npm install
```

Luego generamos el bundle.js con el JS minificado con browserify:

```bash
npm run build
```

#  Ejecución 

Podremos correr el proyecto en un navegador, en dispositivo o simulador Android (al menos las plataformas testeadas):

```bash
# Para correr en el browser 
cordova run browser 

# Para compilar el APK
cordova build android

# Para correrla en el emulador
cordova emulate android

# Para correrla en un dispositivo
cordova run android --device
```

Tener en cuenta que para correrlo en un dispositivo físico
es necesario tenerlo enchufado por USB y haberle activado
el **Debug USB** (Modo desarrollador en Android).
