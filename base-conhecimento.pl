:- dynamic(casa/2).
:- dynamic(vez/1).

% ---------------------------------
% INICIALIZAÇÃO
% ---------------------------------

inicializar :-
    retractall(casa(_, _)),
    retractall(vez(_)),

    assertz(casa(1, v)),
    assertz(casa(2, v)),
    assertz(casa(3, v)),
    assertz(casa(4, v)),
    assertz(casa(5, v)),
    assertz(casa(6, v)),
    assertz(casa(7, v)),
    assertz(casa(8, v)),
    assertz(casa(9, v)),

    assertz(vez(x)).

% ---------------------------------
% JOGADORES
% ---------------------------------

proximo(x, o).
proximo(o, x).


% ---------------------------------
% JOGAR
% ---------------------------------

jogar(Pos) :-
    vez(Jogador),
    casa(Pos, v),
    retract(casa(Pos, v)),
    assertz(casa(Pos, Jogador)),
    trocar_vez.

trocar_vez :-
    vez(Atual),
    proximo(Atual, Prox),
    retract(vez(Atual)),
    assertz(vez(Prox)).

% ---------------------------------
% CONSULTAS AUXILIARES
% ---------------------------------

conteudo(Pos, Valor) :-
    casa(Pos, Valor).

tabuleiro(L) :-
    findall(V, casa(_, V), L).

% ---------------------------------
% VITÓRIA
% ---------------------------------

linha(1,2,3).
linha(4,5,6).
linha(7,8,9).
linha(1,4,7).
linha(2,5,8).
linha(3,6,9).
linha(1,5,9).
linha(3,5,7).

venceu(J) :-
    linha(A, B, C),
    casa(A, J),
    casa(B, J),
    casa(C, J),
    J \= v.

% ---------------------------------
% BOT BOBINHO
% ---------------------------------
posicao_vazia(Pos) :-
    casa(Pos, v).

bot_bobinho :-
    posicao_vazia(1), jogar(1);
    posicao_vazia(2), jogar(2);
    posicao_vazia(3), jogar(3);
    posicao_vazia(4), jogar(4);
    posicao_vazia(5), jogar(5);
    posicao_vazia(6), jogar(6);
    posicao_vazia(7), jogar(7);
    posicao_vazia(8), jogar(8);
    posicao_vazia(9), jogar(9).