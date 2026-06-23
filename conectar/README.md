Conectar — ADB por Wi‑Fi

Este diretório contém uma pequena aplicação Node.js que expõe uma interface web em /conectar para executar comandos ADB básicos (tcpip, connect, disconnect, devices).

Pré-requisitos
- Node.js (>= 14)
- adb (Android Platform Tools) instalado e disponível no PATH do sistema onde o servidor roda
- No celular: Depuração USB ativada; para conectar por Wi‑Fi normalmente é necessário executar `adb tcpip 5555` via USB ou usar o método de emparelhamento do Android 11+.

Instalação e uso
1. No servidor (máquina que executará os comandos adb):
   npm install
   npm start

2. Abra no navegador: http://localhost:3000/conectar

Fluxo típico
- Conecte o celular via USB e clique em "Executar adb tcpip" para ativar o daemon TCP no dispositivo.
- Pegue o IP do dispositivo nas configurações Wi‑Fi (ex: 192.168.1.42).
- Insira o IP e clique em "Conectar". O servidor executará `adb connect ip:porta`.
- Verifique em "Dispositivos" com "Listar dispositivos".

Observações
- Alguns dispositivos e versões Android exigem emparelhamento (Android 11+ Wireless Debugging) em vez do simples `adb connect`. Este sistema executa comandos adb no servidor; ele não substitui a necessidade de seguir os passos de emparelhamento do Android quando aplicável.
- O servidor precisa ter permissões suficientes para executar adb (ex.: adb deve estar instalado e o usuário que roda o servidor deve conseguir invocar o comando).
- Segurança: este é um exemplo simples sem autenticação. Não exponha em redes públicas sem proteção (HTTPS/autenticação).

Arquivo(s) criados
- conectar/package.json
- conectar/server.js
- conectar/public/index.html
- conectar/public/main.js
- conectar/README.md

Se quiser, eu posso:
- Adicionar autenticação básica (usuário/senha) para proteger a interface;
- Implementar suporte ao pairing do Android 11+ (passo a passo para emparelhamento via chave/QR);
- Fazer um Dockerfile para rodar sem instalar adb localmente (a imagem precisará conter platform-tools).
