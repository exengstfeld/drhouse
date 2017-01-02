# Instalación

Esta está desarrollada en JavaScript con [React](http://facebook.github.io/react/index.html) y JSX.
Al usar JSX no hay templates HTML y todo está inline en el JS y distribuido en **componentes**.

Usamos [Cordoba](http://cordova.apache.org/) para homogeneizar la API JS y empaquetar
la app para cada plataforma, y browserify con npm para el manejo de modulos JS.

## Android SDK

[Bajar la SDK](https://developer.android.com/sdk/installing/index.html?pkg=tools), descomprimirla y agregar los paths:

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

y luego en el directorio del proyecto, corremos:

```bash
cordova platform add android
cordova plugin add https://github.com/cordova-sms/cordova-sms-plugin.git
cordova plugin add org.apache.cordova.camera
cordova plugin add org.apache.cordova.network-information
cordova plugin add https://github.com/wildabeast/BarcodeScanner
```

para crear el boilerplate necesario para la plataforma Android® y los plugins necesarios.

# Building

En `witt/www-src/` encontraremos el package.json de la app mobile,
y corriendo

```bash
npm install
```

bajamos las dependencias. Luego para compilar todo:

```bash
npm run watch
```

Que re-compilara ante cambios automáticamente. Tambien tenemos:

```bash
npm run build
```

Para minificar el codigo para producción.

Finalmente en otra consola:

```bash
# Para compilar el APK
cordoba build android

# Para correrla en el emulador
cordoba emulate android

# Para correrla en un dispositivo
cordoba run android --device
```

Tener en cuenta que apra correrla en un dispositivo físico
es necesario tenerlo al mismo enchufado y haberle activado
el **Debug USB**.

# Desarrollo

La aplicación funciona casi toda en un explorador normal, para
esto necesitamos un server cualquiera.

El de python es gloriosamente adecuado para esto, y parandonos en
`witt/www/` podemos simplemente correr:

```bash
python -m SimpleHTTPServer
```

y salir andando en `http://localhost:8000`.

Cuando idesarrollamos en el dispositivo, para ver el log de la consola podemos correr:

```bash
adb logcat CordovaLog:D *:S
```
