% =========================================
% JOGO DA VELHA - BASE DE CONHECIMENTO
% =========================================

:- use_module(library(lists)).

% Convenção:
% v = vazio
% x = jogador X
% o = jogador O

% Um estado será representado por:
% estado(Tabuleiro, JogadorDaVez)
%
% Exemplo:
% estado([v,v,v,v,v,v,v,v,v], x)

% -----------------------------------------
% ESTADO INICIAL
% -----------------------------------------

estado_inicial(
    estado([v,v,v,
            v,v,v,
            v,v,v], x)
).

% -----------------------------------------
% JOGADORES
% -----------------------------------------

jogador(x).
jogador(o).

proximo_jogador(x, o).
proximo_jogador(o, x).

% -----------------------------------------
% POSIÇÕES DO TABULEIRO
% -----------------------------------------
% Índices:
%
% 1 | 2 | 3
% 4 | 5 | 6
% 7 | 8 | 9
%
posicao(1). posicao(2). posicao(3).
posicao(4). posicao(5). posicao(6).
posicao(7). posicao(8). posicao(9).

% -----------------------------------------
% LINHAS VENCEDORAS
% -----------------------------------------

linha_vencedora(1,2,3).
linha_vencedora(4,5,6).
linha_vencedora(7,8,9).
linha_vencedora(1,4,7).
linha_vencedora(2,5,8).
linha_vencedora(3,6,9).
linha_vencedora(1,5,9).
linha_vencedora(3,5,7).

% -----------------------------------------
% ACESSO E ATUALIZAÇÃO DE POSIÇÕES
% -----------------------------------------

% valor_na_posicao(+Tabuleiro, +Pos, -Valor)
valor_na_posicao(Tabuleiro, Pos, Valor) :-
    nth1(Pos, Tabuleiro, Valor).

% substituir(+Lista, +Pos, +NovoValor, -NovaLista)
substituir([_|T], 1, X, [X|T]).
substituir([H|T], Pos, X, [H|R]) :-
    Pos > 1,
    Pos1 is Pos - 1,
    substituir(T, Pos1, X, R).

% -----------------------------------------
% AÇÃO / TRANSIÇÃO DE ESTADO
% -----------------------------------------
% acao(+EstadoAtual, +Posicao, -NovoEstado)
%
% Representa a jogada do jogador da vez em uma posição vazia.
%
acao(estado(Tabuleiro, Jogador),
     Pos,
     estado(NovoTabuleiro, ProximoJogador)) :-

    posicao(Pos),
    valor_na_posicao(Tabuleiro, Pos, v),        % só joga em casa vazia
    substituir(Tabuleiro, Pos, Jogador, NovoTabuleiro),
    proximo_jogador(Jogador, ProximoJogador).

% -----------------------------------------
% JOGADAS POSSÍVEIS
% -----------------------------------------

jogada_possivel(estado(Tabuleiro, _), Pos) :-
    posicao(Pos),
    valor_na_posicao(Tabuleiro, Pos, v).

% -----------------------------------------
% VITÓRIA
% -----------------------------------------

venceu(Tabuleiro, Jogador) :-
    linha_vencedora(A, B, C),
    valor_na_posicao(Tabuleiro, A, Jogador),
    valor_na_posicao(Tabuleiro, B, Jogador),
    valor_na_posicao(Tabuleiro, C, Jogador),
    Jogador \= v.

% -----------------------------------------
% EMPATE
% -----------------------------------------

tabuleiro_cheio([]).
tabuleiro_cheio([H|T]) :-
    H \= v,
    tabuleiro_cheio(T).

empate(estado(Tabuleiro, _)) :-
    tabuleiro_cheio(Tabuleiro),
    \+ venceu(Tabuleiro, x),
    \+ venceu(Tabuleiro, o).

% -----------------------------------------
% ESTADO TERMINAL
% -----------------------------------------

terminal(estado(Tabuleiro, _)) :-
    venceu(Tabuleiro, x).

terminal(estado(Tabuleiro, _)) :-
    venceu(Tabuleiro, o).

terminal(Estado) :-
    empate(Estado).

% -----------------------------------------
% CONSULTAS AUXILIARES
% -----------------------------------------

% vencedor(+Estado, -Jogador)
vencedor(estado(Tabuleiro, _), x) :-
    venceu(Tabuleiro, x).

vencedor(estado(Tabuleiro, _), o) :-
    venceu(Tabuleiro, o).

% casas_vazias(+Estado, -ListaPosicoes)
casas_vazias(estado(Tabuleiro, _), Posicoes) :-
    findall(Pos,
            (posicao(Pos), valor_na_posicao(Tabuleiro, Pos, v)),
            Posicoes).