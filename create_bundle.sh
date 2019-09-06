#!/bin/zsh
# This script will print your username.

echo "package Android bundle............................................................................................"
react-native bundle --entry-file index.js --platform android --dev false --bundle-output ./android/bundle/android.jsbundle --assets-dest ./android/bundle
if [ $? -eq 0 ]; then
    echo OK
else
    echo "Fail to package Android bundle!!!"
    exit 1
  fi

echo "正在打包 IOS bundle"
react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ./ios/bundle/iosC.jsbundle --assets-dest ./ios/bundle
if [ $? -eq 0 ]; then
    echo OK
else
    echo "Fail to package IOS bundle!!!"
    exit 1
  fi

cd ./ios
rm -rf iosAppBundle.zip
zip -r iosAppBundle.zip bundle
if [ $? -eq 0 ]; then
    echo OK
else
    echo "Fail to package IOS bundle!!!"
    exit 1
  fi
cd ..
cd ./android
rm -rf AndroidAppBundle.zip
zip -r AndroidAppBundle.zip bundle
if [ $? -eq 0 ]; then
    echo OK
else
    echo "Fail to package Android bundle!!!"
    exit 1
  fi
