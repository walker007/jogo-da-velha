var tabuleiro = ["a1","a2","a3","b1","b2","b3","c1","c2","c3"],
    players = ["X","O"],
    currentPlayer = 0,
    vencedor,
    endgame = false,
    liberado = true,
    host = 'ws://10.0.0.200:3032',
    ws;

        ws = new WebSocket(host);
        ws.addEventListener('open', function (event){
            event.target.send("{\"type\":\"start\",\"data\":\"null\"}");
            
        });

        ws.addEventListener('message', function(event){
            var resposta = JSON.parse(event.data);
            if(resposta.type == 'start')
            {
               liberado = resposta.liberado;
               inicializaJogoOnline();
            }
            if(resposta.type == 'jogada')
            {
                setJogadaOnline(resposta.data);
            }
        });

        ws.addEventListener('error', inicializaJogo);



function validaVitoria(player)
{
    var vitorias = [
        ["a1","a2","a3"],
        ["b1","b2","b3"],
        ["c1","c2","c3"],
        ["a1","b2","c3"],
        ["c1","b2","a3"],
        ["a1","b1","c1"],
        ["a2","b2","c2"],
        ["a3","b3","c3"],
        ],
        pontuacao = [];

    for(i in vitorias)
    {
        pontuacao[i] = [];
        for(j in vitorias[i])
        {
            var element = document.getElementById(vitorias[i][j]);
            if(players[player] == element.textContent)
            {
                pontuacao[i].push(vitorias[i][j]);
            }
        }

        var venceu = vitorias[i].every(function(value, index) { 
            return pontuacao[i][index] === value; 
         });
 
         if(venceu)
         {
            limpaTabuleiro();
            atualizaPlacar(player);
            return player;
         }
    }
    validaFimJogo();
    return -1;
}

function limpaTabuleiro()
{
    for(i in tabuleiro)
    {
        document.getElementById(tabuleiro[i]).innerHTML = '';
    }
}

function atualizaPlacar(player)
{
    if(player > -1)
    {
        var placarPlayer =  document.getElementById('player'+player);
        placarPlayer.innerText = parseInt(placarPlayer.textContent)+1;
        return;
    }

    var empate = document.getElementById('empate');
    empate.innerText = parseInt(empate.textContent)+1;
    return;

}

function inicializaJogo()
{
    for(i in players)
    {
        document.getElementById('icon'+i).innerText = players[i];
        document.getElementById('player'+i).innerText = 0;
    }
    document.getElementById('empate').innerText = 0;

    window.addEventListener("click", playGame);
    window.addEventListener("touchend", playGame);

    getTurno(currentPlayer);
}

function validaFimJogo()
{
    var count = 0;
    for(i in tabuleiro)
    {
        if(document.getElementById(tabuleiro[i]).textContent)
        {
            count++;
        }
    }

    if(count == 9)
    {
        endgame = true;
    }
}

function getTurno(player)
{
    var turnoDiv = document.getElementById('currentPlayer'), direita = document.getElementById('direita-action');
    turnoDiv.innerHTML = players[player];

    if(liberado)
    {
        direita.innerHTML = "Sua vez";
        return;
    }
    direita.innerHTML = "Vez do Oponente";
}

function validaProximoJogador(vencedor)
{
    if(vencedor === -1 && endgame)
    {
        atualizaPlacar(vencedor);
        limpaTabuleiro();
        endgame = false;
    }
    
    if(vencedor > -1)
    {
        currentPlayer = vencedor
    }

    if(vencedor === -1 && !endgame)
    {
        currentPlayer = (currentPlayer == 0 ? 1 : 0);
    }
}

function playGame(event){
    if(tabuleiro.indexOf(event.target.id) > -1)
    {
       
        if(event.target.textContent)
        {
            return;
        }

        event.target.innerHTML = players[currentPlayer][0];

        vencedor = validaVitoria(currentPlayer);
        
        validaProximoJogador(vencedor);
        liberado = true;
        getTurno(currentPlayer);
    }
}

function playGameOnline(event){
    if(tabuleiro.indexOf(event.target.id) > -1 && liberado)
    {       
        
        if(event.target.textContent)
        {
            return;
        }
        

        event.target.innerHTML = players[currentPlayer][0];
       
        var data = {
            type: "jogada",
            data: tabuleiro.indexOf(event.target.id),
            player: currentPlayer,
        }
        
        ws.send(JSON.stringify(data));
        vencedor = validaVitoria(currentPlayer);
        liberado = (vencedor == currentPlayer);
        validaProximoJogador(vencedor);
        
        getTurno(currentPlayer);
    }
}

function setJogadaOnline(tabuleiroId)
{
    document.getElementById(tabuleiro[tabuleiroId]).innerHTML = players[currentPlayer][0];
    vencedor = validaVitoria(currentPlayer);
    console.log(tabuleiroId, vencedor)
    liberado = (vencedor != currentPlayer);
    validaProximoJogador(vencedor);
    
    getTurno(currentPlayer);
}

function inicializaJogoOnline()
{
    console.log('Jogo online...');
    for(i in players)
    {
        document.getElementById('icon'+i).innerText = players[i];
        document.getElementById('player'+i).innerText = 0;
    }

    document.getElementById('empate').innerText = 0;

    window.addEventListener("click", playGameOnline);
    window.addEventListener("touchend", playGameOnline);

    getTurno(currentPlayer);
}