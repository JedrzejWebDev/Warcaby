// odpowiednio ponazywać interfejsy
function startGame() {
    var playerPawnsAndOpponentPawns = getPlayerPawnsAndOpponentPawns();
    // const fields : NodeListOf<Element> = document.querySelectorAll(".field");
    var playerFieldsAndOpponentFields = getPlayerFieldsAndOpponentFields();
    var anObjectWithANumberOfPawns = countThePawns(playerPawnsAndOpponentPawns);
    var isPlayerMovement = true;
    var isClickedPawn = false;
    var board = [
        ['', 'YBP', '', 'YBP', '', 'YBP', '', 'YBP'],
        ['YBP', '', 'YBP', '', 'YBP', '', 'YBP', ''],
        ['', 'YBP', '', 'YBP', '', 'YBP', '', 'YBP'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['WRP', '', 'WRP', '', 'WRP', '', 'WRP', ''],
        ['', 'WRP', '', 'WRP', '', 'WRP', '', 'WRP'],
        ['WRP', '', 'WRP', '', 'WRP', '', 'WRP', ''],
    ];
    // Funkcja obsługująca ruch gracza i w niej kolejna funkcja obsługująca ruchy niemożliwe do wykonania (poza plansze lub gdy jest możliwość bicia to najpierw trzeba zbić). Czyli trzeba też wykrywanie bicia zrobić. Podczas wszystkich ruchów trzeba zmieniać tablice board
    var lastMarkedField;
    if (isPlayerMovement) {
        playerMovement(isPlayerMovement, playerFieldsAndOpponentFields, isClickedPawn, lastMarkedField);
    }
    endOfTheGame(anObjectWithANumberOfPawns);
}
startGame();
function getPlayerPawnsAndOpponentPawns() {
    var playerPawns = Array.from(document.querySelectorAll(".pawnPlayer1"));
    var opponentPawns = Array.from(document.querySelectorAll(".pawnPlayer2"));
    return { playerPawns: playerPawns, opponentPawns: opponentPawns };
}
function getPlayerFieldsAndOpponentFields() {
    var playerFields = [];
    var opponentFields = [];
    /*
    for(let i=0; i<fields.length; i++) {
        if(fields[i].children[0] != undefined && fields[i].children[0].className == "pawnPlayer1") {
            playerFields[i] = fields[i];
            playerFields = playerFields.filter(function(playerField) {
                return playerField != null;
            })
        } else if(fields[i].children[0] != undefined && fields[i].children[0].className == "pawnPlayer2") {
            opponentFields[i] = fields[i];
            opponentFields = opponentFields.filter(function(opponentField) {
                return opponentField != null;
            })
        }
    }
    */
    var playerPawns = document.querySelectorAll(".pawnPlayer1");
    // console.log(playerPawns[0]); // TU
    // console.log(playerPawns[0].parentElement); // TU
    var opponentPawns = document.querySelectorAll(".pawnPlayer2");
    for (var i = 0; i < playerPawns.length; i++) {
        playerFields[i] = playerPawns[i].parentElement;
        // console.log(playerPawns[i].parentElement);
    }
    for (var i = 0; i < opponentPawns.length; i++) {
        opponentFields[i] = opponentPawns[i].parentElement;
    }
    return { playerFields: playerFields, opponentFields: opponentFields };
    // zapisać niektóre rzeczy krócej w tej funkcji przypisując coś do zmiennych
}
function countThePawns(playerPawnsAndOpponentPawns) {
    var numberOfPlayerPawns = playerPawnsAndOpponentPawns.playerPawns.length;
    var numberOfOpponentPawns = playerPawnsAndOpponentPawns.opponentPawns.length;
    var numberOfAllPawns = numberOfPlayerPawns + numberOfOpponentPawns;
    return { numberOfPlayerPawns: numberOfPlayerPawns, numberOfOpponentPawns: numberOfOpponentPawns, numberOfAllPawns: numberOfAllPawns };
}
function playerMovement(isPlayerMovement, playerFieldsAndOpponentFields, isClickedPawn, lastMarkedField) {
    var canIMove;
    var fieldToWhichICanMove1;
    var fieldToWhichICanMove2;
    var columnNumberToWhichICanMakeAMove;
    var rowNumberToWhichICanMakeAMove;
    var theTwoMostRecentlyClickedFields = [];
    // playerFieldsAndOpponentFields.playerFields = getPlayerFieldsAndOpponentFields().playerFields;
    // console.log(playerFieldsAndOpponentFields.playerFields);
    playerFieldsAndOpponentFields.playerFields.forEach(function (playerField) {
        playerField.addEventListener('click', function (event) {
            if (event.currentTarget && event.currentTarget.children[0] != undefined) { // istnieje pole i pionek w nim
                isClickedPawn = true;
                lastMarkedField = event.currentTarget;
                var lastMarkedPawn = event.currentTarget.children[0];
                lastMarkedField.style.backgroundColor = "rgb(68,68,0)"; // 68,68,0 = #444400;   102,102,0 = #666600;
                theTwoMostRecentlyClickedFields.push(lastMarkedField);
                if (theTwoMostRecentlyClickedFields.length == 3) {
                    theTwoMostRecentlyClickedFields.shift();
                }
                if (theTwoMostRecentlyClickedFields.length == 2) {
                    theTwoMostRecentlyClickedFields[0].style.backgroundColor = '#666600';
                    theTwoMostRecentlyClickedFields[1].style.backgroundColor = '#444400';
                }
            }
            document.addEventListener('click', function (e) {
                if (e.target != lastMarkedField && e.target != lastMarkedField.children[0]) {
                    isClickedPawn = false;
                    lastMarkedField.style.backgroundColor = '#666600';
                    canIMove = false;
                    return;
                }
            });
            // Od tąd
            var firstColumnPlayerPawns = getPlayerPawnsFromTheFirstColumn();
            var filteredFirstColumnPlayerPawns = firstColumnPlayerPawns.filter(function (el) {
                return el != null;
            });
            var lastColumnPlayerPawns = getPlayerPawnsFromTheLastColumn();
            var filteredLastColumnPlayerPawns = lastColumnPlayerPawns.filter(function (el) {
                return el != null;
            });
            var isMarkedPawnFromTheFirstColumn = false;
            var isMarkedPawnFromTheLastColumn = false;
            if (filteredFirstColumnPlayerPawns[0] != undefined) {
                if (event.target == filteredFirstColumnPlayerPawns[0] || event.target == filteredFirstColumnPlayerPawns[0].children[0]) {
                    isMarkedPawnFromTheFirstColumn = true;
                    isMarkedPawnFromTheLastColumn = false;
                }
            }
            if (filteredFirstColumnPlayerPawns[1] != undefined) {
                if (event.target == filteredFirstColumnPlayerPawns[1] || event.target == filteredFirstColumnPlayerPawns[1].children[0]) {
                    isMarkedPawnFromTheFirstColumn = true;
                    isMarkedPawnFromTheLastColumn = false;
                }
            }
            if (filteredFirstColumnPlayerPawns[2] != undefined) {
                if (event.target == filteredFirstColumnPlayerPawns[2] || event.target == filteredFirstColumnPlayerPawns[2].children[0]) {
                    isMarkedPawnFromTheFirstColumn = true;
                    isMarkedPawnFromTheLastColumn = false;
                }
            }
            if (filteredFirstColumnPlayerPawns[3] != undefined) {
                if (event.target == filteredFirstColumnPlayerPawns[3] || event.target == filteredFirstColumnPlayerPawns[3].children[0]) {
                    isMarkedPawnFromTheFirstColumn = true;
                    isMarkedPawnFromTheLastColumn = false;
                }
            }
            if (filteredLastColumnPlayerPawns[0] != undefined) {
                if (event.target == filteredLastColumnPlayerPawns[0] || event.target == filteredLastColumnPlayerPawns[0].children[0]) {
                    isMarkedPawnFromTheFirstColumn = false;
                    isMarkedPawnFromTheLastColumn = true;
                }
            }
            if (filteredLastColumnPlayerPawns[1] != undefined) {
                if (event.target == filteredLastColumnPlayerPawns[1] || event.target == filteredLastColumnPlayerPawns[1].children[0]) {
                    isMarkedPawnFromTheFirstColumn = false;
                    isMarkedPawnFromTheLastColumn = true;
                }
            }
            if (filteredLastColumnPlayerPawns[2] != undefined) {
                if (event.target == filteredLastColumnPlayerPawns[2] || event.target == filteredLastColumnPlayerPawns[2].children[0]) {
                    isMarkedPawnFromTheFirstColumn = false;
                    isMarkedPawnFromTheLastColumn = true;
                }
            }
            if (filteredLastColumnPlayerPawns[3] != undefined) {
                if (event.target == filteredLastColumnPlayerPawns[3] || event.target == filteredLastColumnPlayerPawns[3].children[0]) {
                    isMarkedPawnFromTheFirstColumn = false;
                    isMarkedPawnFromTheLastColumn = true;
                }
            }
            if (isMarkedPawnFromTheFirstColumn) {
                movementOfThePlayerPawnFromTheLeftColumn(event.target);
            }
            else if (isMarkedPawnFromTheLastColumn) {
            }
            else {
            }
        });
    });
    isPlayerMovement = false;
}
function getPlayerPawnsFromTheFirstColumn() {
    var howManyRows = document.querySelectorAll(".row").length;
    var firstColumnPlayerPawns = [];
    var firstColumnPlayerPawns2 = [];
    for (var i = 0; i < howManyRows; i++) {
        firstColumnPlayerPawns[i] = document.querySelector("[data-col=c0][data-row=r" + i + "]");
        if (firstColumnPlayerPawns[i].children[0] != undefined) {
            if (firstColumnPlayerPawns[i].children[0].className == "pawnPlayer1") {
                firstColumnPlayerPawns2[i] = firstColumnPlayerPawns[i];
            }
        }
    }
    return firstColumnPlayerPawns2;
}
function getPlayerPawnsFromTheLastColumn() {
    var howManyRows = document.querySelectorAll(".row").length;
    var lastColumnPlayerPawns = [];
    var lastColumnPlayerPawns2 = [];
    for (var i = 0; i < howManyRows; i++) {
        lastColumnPlayerPawns[i] = document.querySelector("[data-col=c7][data-row=r" + i + "]");
        if (lastColumnPlayerPawns[i].children[0] != undefined) {
            if (lastColumnPlayerPawns[i].children[0].className == "pawnPlayer1") {
                lastColumnPlayerPawns2[i] = lastColumnPlayerPawns[i];
            }
        }
    }
    return lastColumnPlayerPawns2;
}
function movementOfThePlayerPawnFromTheLeftColumn(clickedField) {
    if (clickedField != null && clickedField instanceof HTMLElement) {
        if (clickedField.className == "pawnPlayer1") {
            clickedField = clickedField.parentElement;
        }
    }
    if (clickedField != null && clickedField instanceof HTMLElement) {
        if (clickedField.dataset.row != undefined && clickedField.dataset.col != undefined) {
            var rowOfFieldToWhichICanMove = Number((clickedField.dataset.row).slice(1)) - 1;
            var colOfFieldToWhichICanMove = Number((clickedField.dataset.col).slice(1)) + 1;
            var aFieldToWhichICanMove = document.querySelector("[data-col=c" + colOfFieldToWhichICanMove + "][data-row=r" + rowOfFieldToWhichICanMove + "]");
            console.log(aFieldToWhichICanMove);
        }
    }
}
function uncheckingTheFieldICanMoveTo(aFieldThatICanMoveToAndWantToUncheck, lastClickedField, canIMove) {
    document.addEventListener("click", function (e) {
        if (e.target != lastClickedField && e.target != lastClickedField.children[0] && e.target != aFieldThatICanMoveToAndWantToUncheck && e.target != aFieldThatICanMoveToAndWantToUncheck.children[0]) { // I e.target różne od pola na które się ruszyłem (chyba fieldToWhichICanMove). Wtedy będę mógł odkomentować to na dole!!!!! (Mogą pojawić się problemy jak będę się poruszać damką z powrotem na pola na których byłem CHYBA)
            aFieldThatICanMoveToAndWantToUncheck.style.backgroundColor = "#666600";
            canIMove = false;
        }
    });
}
function endOfTheGame(anObjectWithANumberOfPawns) {
    // Usunąć możliwość dalszej gry (dalszego robienia ruchów na obecnej planszy)
    if (anObjectWithANumberOfPawns.numberOfPlayerPawns == 0) {
        console.log("Zwyci\u0119\u017Cy\u0142 przeciwnik");
    }
    else if (anObjectWithANumberOfPawns.numberOfOpponentPawns == 0) {
        console.log("Zwyci\u0119\u017Cy\u0142 gracz");
    }
}
// Teraz zrobić tak że mogę wykonać ruch tylko wtedy jeśli pole jest podświetlone bo jeżeli odznacze pionek którym mogłem się ruszyć i zaznacze inny i kliknę na pole na które mogłem się poruszyć pionek którym mogłem się przenieść zostanie przeniesiony
