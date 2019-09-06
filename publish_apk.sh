#!/bin/zsh

echo "正在发布 apk 到 fir............................................................................................"

cd ~/Desktop/apk
for apkName in $(ls *.apk)
do
  fir publish $apkName
done
