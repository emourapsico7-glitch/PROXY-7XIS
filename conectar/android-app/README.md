Conectar Notify — Android helper app

Comportamento atual: quando a notificação é tocada, o app abre uma tela com o "Pair address" e o campo "Código de emparelhamento".

Nova funcionalidade: o app agora envia automaticamente o código ao servidor assim que a tela abre e o campo de código estiver preenchido (modo automático ativado por padrão). Isso acelera o fluxo: ao tocar na notificação o código é enviado sem precisar tocar em "Enviar".

Se preferir desabilitar o auto-envio, edite `SubmitActivity.kt` e altere a variável `autoSend` para `false`.

Como testar
1. Configure `server_url` em `app/src/main/res/values/strings.xml` (ex: http://192.168.1.100:3000).
2. Build o APK e instale no dispositivo.
3. Dispare a notificação com `pairAddress` e `text` (contendo o código). Ao tocar a notificação, a atividade abrirá e, se encontrar um código, enviará automaticamente para o servidor `/conectar/api/pair-submit`.

Observação de segurança
- O envio automático facilita o fluxo, mas significa que qualquer notificação válida fará o envio do código assim que tocada. Se desejar confirmação manual, desabilite `autoSend`.
