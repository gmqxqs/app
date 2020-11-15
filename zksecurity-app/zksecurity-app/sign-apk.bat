jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore lock.jks platforms/android/build/outputs/apk/android-release-unsigned.apk door_lock -storepass locktest99! -keypass doorlock899!
zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk zksecurity.apk
apksigner verify zksecurity.apk
pause