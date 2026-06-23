# Instructions to build and install the Android helper app

1. Open `conectar/android-app` in Android Studio.
2. Edit `app/src/main/res/values/strings.xml` and set `server_url` to the address where your Conectar server is reachable (e.g., `http://192.168.1.100:3000`).
3. Build the APK (Build -> Build Bundle(s) / APK(s) -> Build APK(s)).
4. Install on device using: `adb install -r app/build/outputs/apk/debug/app-debug.apk`.

Behavior added: pre-fill pairing code
- The app now pre-fills the "Código de emparelhamento" field with the text received in the notification (it prefers digit-only content when available). This makes it faster to submit the code: when you tap the notification the code will already be entered; just check and press "Enviar".

Usage
- From the server: trigger the notify endpoint with pairAddress included, for example:
  POST /conectar/api/notify
  { "device": "0123456789abcdef", "title": "Informe o código", "text": "123456", "pairAddress": "192.168.1.42:37199" }
- The device will receive a notification; ao tocar, abrirá a tela com o código já preenchido (quando possível) — confirme e toque em "Enviar".
- The server will use /conectar/api/pair-submit to execute `adb pair <address>` with the received code and, optionally, try `adb connect ip:5555`.
