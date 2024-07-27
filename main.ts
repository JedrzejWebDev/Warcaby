// odpowiednio ponazywać interfejsy
// Hello
interface ObjectOfArrays {
    playerPawns: Array<Element>;
    opponentPawns: Array<Element>;
}

interface ObjectOfArraysV2 {
    playerFields: Array<Element>;
    opponentFields: Array<Element>;
}

interface ObjectOfNumbers {
    numberOfPlayerPawns: number;
    numberOfOpponentPawns: number;
    numberOfAllPawns: number;
}

function startGame() {
    const playerPawnsAndOpponentPawns : ObjectOfArrays = getPlayerPawnsAndOpponentPawns();
    // const fields : NodeListOf<Element> = document.querySelectorAll(".field");
    let playerFieldsAndOpponentFields : ObjectOfArraysV2 = getPlayerFieldsAndOpponentFields();
    const anObjectWithANumberOfPawns : ObjectOfNumbers = countThePawns(playerPawnsAndOpponentPawns);
    let isPlayerMovement : boolean = true;
    let isClickedPawn : boolean = false;
    const board : string[][] = [
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
    let lastMarkedField : any;
    if(isPlayerMovement) {
        playerMovement(isPlayerMovement, playerFieldsAndOpponentFields, isClickedPawn, lastMarkedField);
    }

    endOfTheGame(anObjectWithANumberOfPawns);
}

startGame();

interface PlayerAndOpponentPawns {
    playerPawns: Array<Element>,
    opponentPawns: Array<Element>
}

interface ArrayConstructor {
    // To zostało skopiowane z neta (było tego więcej ale usunąłem błędy)
    from(arrayLike: any): Array<any>;
}

function getPlayerPawnsAndOpponentPawns() : PlayerAndOpponentPawns {
    const playerPawns = Array.from(document.querySelectorAll(".pawnPlayer1"));
    const opponentPawns = Array.from(document.querySelectorAll(".pawnPlayer2"));
    return {playerPawns, opponentPawns};
}

function getPlayerFieldsAndOpponentFields() : ObjectOfArraysV2 {
    let playerFields : Array<any> = [];
    let opponentFields : Array<any> = [];
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
    const playerPawns = document.querySelectorAll(".pawnPlayer1");
    // console.log(playerPawns[0]); // TU
    // console.log(playerPawns[0].parentElement); // TU
    const opponentPawns = document.querySelectorAll(".pawnPlayer2");
    for(let i=0; i<playerPawns.length; i++) {
        playerFields[i] = playerPawns[i].parentElement;
        // console.log(playerPawns[i].parentElement);
    }

    for(let i=0; i<opponentPawns.length; i++) {
        opponentFields[i] = opponentPawns[i].parentElement;
    }

    return {playerFields, opponentFields};
    // zapisać niektóre rzeczy krócej w tej funkcji przypisując coś do zmiennych
}

interface TheNumberOfIndividualAndAllPawns {
    numberOfPlayerPawns: number,
    numberOfOpponentPawns: number,
    numberOfAllPawns: number
}

function countThePawns(playerPawnsAndOpponentPawns : ObjectOfArrays) : TheNumberOfIndividualAndAllPawns {
    let numberOfPlayerPawns : number = playerPawnsAndOpponentPawns.playerPawns.length;
    let numberOfOpponentPawns : number = playerPawnsAndOpponentPawns.opponentPawns.length;
    let numberOfAllPawns : number = numberOfPlayerPawns + numberOfOpponentPawns;
    return {numberOfPlayerPawns, numberOfOpponentPawns, numberOfAllPawns};
}

function playerMovement(isPlayerMovement : boolean, playerFieldsAndOpponentFields : ObjectOfArraysV2, isClickedPawn: boolean, lastMarkedField : any) {
    let canIMove : boolean;
    let fieldToWhichICanMove1 : HTMLElement | null;
    let fieldToWhichICanMove2 : HTMLElement | null;

    let columnNumberToWhichICanMakeAMove : Number | undefined;
    let rowNumberToWhichICanMakeAMove : Number | undefined;

    let theTwoMostRecentlyClickedFields : any = [];

    // playerFieldsAndOpponentFields.playerFields = getPlayerFieldsAndOpponentFields().playerFields;
    // console.log(playerFieldsAndOpponentFields.playerFields);
    playerFieldsAndOpponentFields.playerFields.forEach((playerField : Element) => { //  playerFieldsAndOpponentFields.playerFields
        playerField.addEventListener('click', (event: Event) => {          
            if(event.currentTarget && (event.currentTarget as HTMLElement).children[0] != undefined) { // istnieje pole i pionek w nim
                isClickedPawn = true;
                lastMarkedField = event.currentTarget as HTMLButtonElement;
                const lastMarkedPawn : Element = (event.currentTarget as HTMLButtonElement).children[0];
                lastMarkedField.style.backgroundColor = "rgb(68,68,0)"; // 68,68,0 = #444400;   102,102,0 = #666600;

                theTwoMostRecentlyClickedFields.push(lastMarkedField);
                
                if(theTwoMostRecentlyClickedFields.length == 3) {
                    theTwoMostRecentlyClickedFields.shift();
                }

                if(theTwoMostRecentlyClickedFields.length == 2) {
                    theTwoMostRecentlyClickedFields[0].style.backgroundColor = '#666600';
                    theTwoMostRecentlyClickedFields[1].style.backgroundColor = '#444400';
                }
            }

            document.addEventListener('click', (e: Event) => {
                if(e.target != lastMarkedField && e.target != lastMarkedField.children[0]) {
                    isClickedPawn = false;
                    lastMarkedField.style.backgroundColor = '#666600';
                    canIMove = false;
                    return;
                }
            })

            // Od tąd

            let firstColumnPlayerPawns = getPlayerPawnsFromTheFirstColumn();
            let filteredFirstColumnPlayerPawns = firstColumnPlayerPawns.filter(function(el) {
                return el != null;
            })
        
            let lastColumnPlayerPawns = getPlayerPawnsFromTheLastColumn();
            let filteredLastColumnPlayerPawns = lastColumnPlayerPawns.filter(function(el) {
                return el != null;
            })
        
            let isMarkedPawnFromTheFirstColumn = false;
            let isMarkedPawnFromTheLastColumn = false;

            if(filteredFirstColumnPlayerPawns[0] != undefined) {
                if(event.target == filteredFirstColumnPlayerPawns[0] || event.target == filteredFirstColumnPlayerPawns[0].children[0]) {
                    isMarkedPawnFromTheFirstColumn = true;
                    isMarkedPawnFromTheLastColumn = false;
                }
            }
            if(filteredFirstColumnPlayerPawns[1] != undefined) {
                if(event.target == filteredFirstColumnPlayerPawns[1] || event.target == filteredFirstColumnPlayerPawns[1].children[0]) {
                    isMarkedPawnFromTheFirstColumn = true;
                    isMarkedPawnFromTheLastColumn = false;
                }
            }
            if(filteredFirstColumnPlayerPawns[2] != undefined) {
                if(event.target == filteredFirstColumnPlayerPawns[2] || event.target == filteredFirstColumnPlayerPawns[2].children[0]) {
                    isMarkedPawnFromTheFirstColumn = true;
                    isMarkedPawnFromTheLastColumn = false;
                }            
            }
            if(filteredFirstColumnPlayerPawns[3] != undefined) {
                if(event.target == filteredFirstColumnPlayerPawns[3] || event.target == filteredFirstColumnPlayerPawns[3].children[0]) {
                    isMarkedPawnFromTheFirstColumn = true;
                    isMarkedPawnFromTheLastColumn = false;
                }            
            }
    
            if(filteredLastColumnPlayerPawns[0] != undefined) {
                if(event.target == filteredLastColumnPlayerPawns[0] || event.target == filteredLastColumnPlayerPawns[0].children[0]) {
                    isMarkedPawnFromTheFirstColumn = false;
                    isMarkedPawnFromTheLastColumn = true;
                }
            }
            if(filteredLastColumnPlayerPawns[1] != undefined) {
                if(event.target == filteredLastColumnPlayerPawns[1] || event.target == filteredLastColumnPlayerPawns[1].children[0]) {
                    isMarkedPawnFromTheFirstColumn = false;
                    isMarkedPawnFromTheLastColumn = true;
                }
            }
            if(filteredLastColumnPlayerPawns[2] != undefined) {
                if(event.target == filteredLastColumnPlayerPawns[2] || event.target == filteredLastColumnPlayerPawns[2].children[0]) {
                    isMarkedPawnFromTheFirstColumn = false;
                    isMarkedPawnFromTheLastColumn = true;
                }
            }
            if(filteredLastColumnPlayerPawns[3] != undefined) {
                if(event.target == filteredLastColumnPlayerPawns[3] || event.target == filteredLastColumnPlayerPawns[3].children[0]) {
                    isMarkedPawnFromTheFirstColumn = false;
                    isMarkedPawnFromTheLastColumn = true;
                }
            }
    
    
            if(isMarkedPawnFromTheFirstColumn) {
                movementOfThePlayerPawnFromTheLeftColumn(event.target);
            } else if(isMarkedPawnFromTheLastColumn) {

            } else {

            }
        })
    })

    isPlayerMovement = false;
}

function getPlayerPawnsFromTheFirstColumn() {
    const howManyRows : number = document.querySelectorAll(".row").length;
    let firstColumnPlayerPawns = [];
    let firstColumnPlayerPawns2 = [];

    for(let i=0; i<howManyRows; i++) {
        firstColumnPlayerPawns[i] = document.querySelector(`[data-col=c0][data-row=r${i}]`);
        if(firstColumnPlayerPawns[i].children[0] != undefined) {
            if(firstColumnPlayerPawns[i].children[0].className == "pawnPlayer1") {
                firstColumnPlayerPawns2[i] = firstColumnPlayerPawns[i];
            }
        }
    }
    return firstColumnPlayerPawns2;
}

function getPlayerPawnsFromTheLastColumn() {
    const howManyRows : number = document.querySelectorAll(".row").length;
    let lastColumnPlayerPawns = [];
    let lastColumnPlayerPawns2 = [];

    for(let i=0; i<howManyRows; i++) {
        lastColumnPlayerPawns[i] = document.querySelector(`[data-col=c7][data-row=r${i}]`);
        if(lastColumnPlayerPawns[i].children[0] != undefined) {
            if(lastColumnPlayerPawns[i].children[0].className == "pawnPlayer1") {
                lastColumnPlayerPawns2[i] = lastColumnPlayerPawns[i];
            }
        }
    }
    return lastColumnPlayerPawns2;
}

function movementOfThePlayerPawnFromTheLeftColumn(clickedField : EventTarget | null) {
    if(clickedField != null && clickedField instanceof HTMLElement) {
        if(clickedField.className == "pawnPlayer1") {
            clickedField = clickedField.parentElement;
        }
    }

    if(clickedField != null && clickedField instanceof HTMLElement) {
        if(clickedField.dataset.row != undefined && clickedField.dataset.col != undefined) {
            const rowOfFieldToWhichICanMove = Number((clickedField.dataset.row).slice(1)) - 1;
            const colOfFieldToWhichICanMove = Number((clickedField.dataset.col).slice(1)) + 1;

            const aFieldToWhichICanMove : HTMLElement | null = document.querySelector(`[data-col=c${colOfFieldToWhichICanMove}][data-row=r${rowOfFieldToWhichICanMove}]`);
            console.log(aFieldToWhichICanMove);
        }
    }
}

function uncheckingTheFieldICanMoveTo(aFieldThatICanMoveToAndWantToUncheck : any, lastClickedField : HTMLElement, canIMove? : boolean) {
    document.addEventListener("click", (e: Event) => { // Tego listenera muszę chyba usunąć po zrobieniu ruchu (już nie aktualne)
        if(e.target != lastClickedField && e.target != lastClickedField.children[0] && e.target != aFieldThatICanMoveToAndWantToUncheck && e.target != aFieldThatICanMoveToAndWantToUncheck.children[0]) { // I e.target różne od pola na które się ruszyłem (chyba fieldToWhichICanMove). Wtedy będę mógł odkomentować to na dole!!!!! (Mogą pojawić się problemy jak będę się poruszać damką z powrotem na pola na których byłem CHYBA)
            aFieldThatICanMoveToAndWantToUncheck.style.backgroundColor = `#666600`;
            canIMove = false;
        }
    })
}

function endOfTheGame(anObjectWithANumberOfPawns : ObjectOfNumbers) {
    // Usunąć możliwość dalszej gry (dalszego robienia ruchów na obecnej planszy)
    if(anObjectWithANumberOfPawns.numberOfPlayerPawns == 0) {
        console.log(`Zwyciężył przeciwnik`);
    } else if(anObjectWithANumberOfPawns.numberOfOpponentPawns == 0) {
        console.log(`Zwyciężył gracz`);
    }
}

// Teraz zrobić tak że mogę wykonać ruch tylko wtedy jeśli pole jest podświetlone bo jeżeli odznacze pionek którym mogłem się ruszyć i zaznacze inny i kliknę na pole na które mogłem się poruszyć pionek którym mogłem się przenieść zostanie przeniesiony