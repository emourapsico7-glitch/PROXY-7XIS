Conectar — ADB por Wi‑Fi

Este diretório contém uma pequena aplicação Node.js que expõe uma UI web em /conectar para executar comandos ADB básicos (tcpip, pair, connect, disconnect, devices).

Pré-requisitos
- Node.js (>= 14)
- adb (Android Platform Tools) instalado e disponível no PATH do sistema onde o servidor roda
- No celular: Depuração USB ativada; para conectar por Wi‑Fi normalmente é necessário executar `adb tcpip 5555` via USB ou usar o método de emparelhamento do Android 11+ (Wireless debugging).

Instalação e uso
1. No servidor (máquina que executará os comandos adb):
   npm install
   npm start

2. Abra no navegador: http://localhost:3000/conectar

Fluxo típico
- Conecte o celular via USB e clique em "Executar adb tcpip" para ativar o daemon TCP no dispositivo.
- Para dispositivos com Android 11+ e Wireless debugging:
  - No dispositivo: Opções do desenvolvedor → Wireless debugging → Pair device with pairing code.
  - Anote o endereço e a porta exibidos (ex: 192.168.1.42:37199) e o código de emparelhamento.
  - Na UI em "Emparelhamento", informe o IP, a porta e o código e clique em "Emparelhar (pair)".
  - Após emparelhar com sucesso, use "Conectar" para estabelecer a conexão ADB por Wi‑Fi (ip:porta usualmente 5555).

- Pegue o IP do dispositivo nas configurações Wi‑Fi (ex: 192.168.1.42).
- Insira o IP na UI e clique em "Conectar". O servidor executará `adb connect ip:porta`.
- Verifique em "Dispositivos" com "Listar dispositivos".

Observações
- Alguns dispositivos e versões Android exigem emparelhamento (Android 11+ Wireless Debugging) em vez do simples `adb connect`. Este sistema executa comandos adb no servidor e implementa um endpoint para facilitar o fluxo de emparelhamento, mas pode depender da versão do platform-tools instalada.
- Se o seu platform-tools for antigo, atualize o adb para a versão mais recente.
- Segurança: este é um exemplo simples sem autenticação. Não exponha em redes públicas sem proteção (HTTPS/autenticação).

Mensagens de erro comuns e como diagnosticar
- “adb: command not found” → adb não está no PATH do usuário que executa o servidor.
- Timeout/erro ao conectar → verifique se o dispositivo está na mesma rede e se o daemon TCP foi ativado (`adb tcpip 5555`).
- Emparelhamento necessário → siga as instruções de Wireless Debugging no dispositivo (Android 11+): abra Wireless debugging nas Opções do desenvolvedor e use o par de emparelhamento (ou QR).

Arquivo(s) atualizados
- conectar/server.js (novo endpoint /conectar/api/pair)
- conectar/public/index.html (UI para emparelhamento)
- conectar/public/main.js (chamada ao endpoint pair)
- conectar/README.md (instruções de emparelhamento)

Próximos passos que posso fazer
- Adicionar autenticação básica (usuário/senha) e HTTPS para proteger a interface;
- Criar Dockerfile para rodar sem instalar adb localmente (a imagem precisa conter platform-tools);
- Melhorar logs/ui com histórico de comandos e status por dispositivo.

Se quiser, implemento a autenticação (rápido) ou crio o Dockerfile em seguida.