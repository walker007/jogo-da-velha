# Jogo da Velha em HTML5 e Javascript

Este jogo da velha é escrito em Javascript e HTML5, para o estudo de css grid, HTML semântico e o uso de websockets;
Não é obrigatório que exista um servidor de websocket rodando para a aplicação funcionar, uma vez que existe o modo de jogo local.

Caso deseje Jogar online, basta que configure um servidor de websocket e atribua o servidor e a porta à variável ```host``` que fica na linha 7 do arquivo ```game.js```.

A paleta de cores do jogo foi inspirada no Tema Drácula.

A aplicação é responsiva, funcionando também em dispositivos touch.

---
## Servidor de Websocket

O servidor de websocket separa os jogadores em pares conforme vão se conectando, não existindo uma limitação de quantidade de jogadores.

Para iniciar o servidor, execute o comando:
```sh
php server host=127.0.0.1 port=3032
```

Trocando o valor de ```host``` para o IP que deseja executar o servidor, o servidor somente será iniciado caso haja o host e port.