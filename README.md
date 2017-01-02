# Instalación

## Nodejs

Agregamos el ppa de Node:

```bash
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
```

## Cordova

Instalamos la CLI tool de Cordoba:

```bash
sudo npm install -g cordova
```

y luego en el directorio del proyecto, corremos:

```bash
cordova platform add browser

```

# Building

En `www/` encontraremos el package.json de la app mobile,
y corriendo

```bash
npm install
```

bajamos las dependencias. Luego para compilar todo:

```bash
npm run build
```

Finalmente en otra consola:

```bash
# Para el platform browser
cordoba build browser

# Para correrla en brwoser
cordoba run browser

# Para correrla en dispositivo
cordoba run android --device
```
Tener en cuenta que apra correrla en un dispositivo físico
es necesario tenerlo al mismo enchufado y haberle activado
el **Debug USB**.

## Android SDK

* ESTO ES PARA CORRERLO CON EL EMULADOR

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
