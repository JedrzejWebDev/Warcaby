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
    const playerPawnsAndOpponentPawns: ObjectOfArrays = getPlayerPawnsAndOpponentPawns();
    let playerFieldsAndOpponentFields: ObjectOfArraysV2 = getPlayerFieldsAndOpponentFields();
    const anObjectWithANumberOfPawns: ObjectOfNumbers = countThePawns(playerPawnsAndOpponentPawns);
    let isPlayerMovement: boolean = true;
    let isClickedPawn: boolean = false;
    const board: string[][] = [
        ['', 'YBP', '', 'YBP', '', 'YBP', '', 'YBP'],
        ['YBP', '', 'YBP', '', 'YBP', '', 'YBP', ''],
        ['', 'YBP', '', 'YBP', '', 'YBP', '', 'YBP'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['WRP', '', 'WRP', '', 'WRP', '', 'WRP', ''],
        ['', 'WRP', '', 'WRP', '', 'WRP', '', 'WRP'],
        ['WRP', '', 'WRP', '', 'WRP', '', 'WRP', ''],
    ];
    let lastMarkedField: any;
    if (isPlayerMovement) {
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
    from(arrayLike: any): Array<any>;
}

function getPlayerPawnsAndOpponentPawns(): PlayerAndOpponentPawns {
    const playerPawns = Array.from(document.querySelectorAll(".pawnPlayer1"));
    const opponentPawns = Array.from(document.querySelectorAll(".pawnPlayer2"));
    return { playerPawns, opponentPawns };
}

function getPlayerFieldsAndOpponentFields(): ObjectOfArraysV2 {
    let playerFields: Array<any> = [];
    let opponentFields: Array<any> = [];

    const playerPawns = document.querySelectorAll(".pawnPlayer1");
    const opponentPawns = document.querySelectorAll(".pawnPlayer2");

    for (let i = 0; i < playerPawns.length; i++) {
        playerFields[i] = playerPawns[i].parentElement;
    }

    for (let i = 0; i < opponentPawns.length; i++) {
        opponentFields[i] = opponentPawns[i].parentElement;
    }

    return { playerFields, opponentFields };
}

interface TheNumberOfIndividualAndAllPawns {
    numberOfPlayerPawns: number,
    numberOfOpponentPawns: number,
    numberOfAllPawns: number
}

function countThePawns(playerPawnsAndOpponentPawns: ObjectOfArrays): TheNumberOfIndividualAndAllPawns {
    let numberOfPlayerPawns: number = playerPawnsAndOpponentPawns.playerPawns.length;
    let numberOfOpponentPawns: number = playerPawnsAndOpponentPawns.opponentPawns.length;
    let numberOfAllPawns: number = numberOfPlayerPawns + numberOfOpponentPawns;
    return { numberOfPlayerPawns, numberOfOpponentPawns, numberOfAllPawns };
}

function playerMovement(isPlayerMovement: boolean, playerFieldsAndOpponentFields: ObjectOfArraysV2, isClickedPawn: boolean, lastMarkedField: any) {
    let canIMove: boolean;
    let fieldToWhichICanMove1: HTMLElement | null;
    let fieldToWhichICanMove2: HTMLElement | null;

    let columnNumberToWhichICanMakeAMove: Number | undefined;
    let rowNumberToWhichICanMakeAMove: Number | undefined;

    let theTwoMostRecentlyClickedFields: any = [];

    playerFieldsAndOpponentFields.playerFields.forEach((playerField: Element) => {
        playerField.addEventListener('click', (event: Event) => {
            let aFieldToWhichICanMove: HTMLElement | null;
            if (event.currentTarget && (event.currentTarget as HTMLElement).children[0] != undefined) {
                isClickedPawn = true;
                lastMarkedField = event.currentTarget as HTMLButtonElement;
                const lastMarkedPawn: Element = (event.currentTarget as HTMLButtonElement).children[0];

                theTwoMostRecentlyClickedFields.push(lastMarkedField);

                if (theTwoMostRecentlyClickedFields.length == 3) {
                    theTwoMostRecentlyClickedFields.shift();
                }

                if (theTwoMostRecentlyClickedFields.length == 2) {
                    theTwoMostRecentlyClickedFields[0].style.backgroundColor = '#666600';
                    theTwoMostRecentlyClickedFields[1].style.backgroundColor = '#444400';
                }
            }

            document.addEventListener('click', (e: Event) => {
                if (e.target != lastMarkedField && e.target != lastMarkedField.children[0]) {
                    isClickedPawn = false;
                    lastMarkedField.style.backgroundColor = '#666600';
                    canIMove = false;
                    return;
                }
            })

            let firstColumnPlayerPawns = getPlayerPawnsFromTheFirstColumn();
            let filteredFirstColumnPlayerPawns = firstColumnPlayerPawns.filter(function (el) {
                return el != null;
            })

            let lastColumnPlayerPawns = getPlayerPawnsFromTheLastColumn();
            let filteredLastColumnPlayerPawns = lastColumnPlayerPawns.filter(function (el) {
                return el != null;
            })

            let isMarkedPawnFromTheFirstColumn = false;
            let isMarkedPawnFromTheLastColumn = false;

            if (filteredFirstColumnPlayerPawns[0] != undefined) {
                if (event.target == filteredFirstColumnPlayerPawns[0] || event.target == filteredFirstColumnPlayerPawns[0].children[0]) {
                    isMarkedPawnFromTheFirstColumn = true;
                    isMarkedPawnFromTheLastColumn = false;

                    if (event.target instanceof HTMLElement && event.target.dataset.row != undefined && event.target.dataset.col != undefined) {
                        const rowOfFieldToWhichICanMove = Number((event.target.dataset.row).slice(1)) - 1;
                        const colOfFieldToWhichICanMove = Number((event.target.dataset.col).slice(1)) + 1;

                        aFieldToWhichICanMove = document.querySelector(`[data-col=c${colOfFieldToWhichICanMove}][data-row=r${rowOfFieldToWhichICanMove}]`);

                        if (aFieldToWhichICanMove != null) {
                            if (aFieldToWhichICanMove.children[0] == undefined) {
                                lastMarkedField.style.backgroundColor = "rgb(68,68,0)";
                            }
                        }

                        uncheckingTheFieldICanMoveTo(aFieldToWhichICanMove, lastMarkedField);

                    } else if (event.target instanceof HTMLElement && event.target.className == "pawnPlayer1" && event.target.parentElement != null) {
                        if (event.target.parentElement.dataset.row != undefined && event.target.parentElement.dataset.col != undefined) {
                            const rowOfFieldToWhichICanMove = Number((event.target.parentElement.dataset.row).slice(1)) - 1;
                            const colOfFieldToWhichICanMove = Number((event.target.parentElement.dataset.col).slice(1)) + 1;

                            aFieldToWhichICanMove = document.querySelector(`[data-col=c${colOfFieldToWhichICanMove}][data-row=r${rowOfFieldToWhichICanMove}]`);

                            if (aFieldToWhichICanMove != null) {
                                if (aFieldToWhichICanMove.children[0] == undefined) {
                                    event.target.parentElement.style.backgroundColor = "rgb(68,68,0)";
                                }
                            }

                            uncheckingTheFieldICanMoveTo(aFieldToWhichICanMove, lastMarkedField);
                        }
                    }
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

                    if (event.target instanceof HTMLElement && event.target.dataset.row != undefined && event.target.dataset.col != undefined) {
                        const rowOfFieldToWhichICanMove = Number((event.target.dataset.row).slice(1)) - 1;
                        const colOfFieldToWhichICanMove = Number((event.target.dataset.col).slice(1)) - 1;

                        aFieldToWhichICanMove = document.querySelector(`[data-col=c${colOfFieldToWhichICanMove}][data-row=r${rowOfFieldToWhichICanMove}]`);

                        if (aFieldToWhichICanMove != null) {
                            if (aFieldToWhichICanMove.children[0] == undefined) {
                                lastMarkedField.style.backgroundColor = "rgb(68,68,0)";
                            }
                        }

                        uncheckingTheFieldICanMoveTo(aFieldToWhichICanMove, lastMarkedField);

                    } else if (event.target instanceof HTMLElement && event.target.className == "pawnPlayer1" && event.target.parentElement != null) {
                        if (event.target.parentElement.dataset.row != undefined && event.target.parentElement.dataset.col != undefined) {
                            const rowOfFieldToWhichICanMove = Number((event.target.parentElement.dataset.row).slice(1)) - 1;
                            const colOfFieldToWhichICanMove = Number((event.target.parentElement.dataset.col).slice(1)) - 1;

                            aFieldToWhichICanMove = document.querySelector(`[data-col=c${colOfFieldToWhichICanMove}][data-row=r${rowOfFieldToWhichICanMove}]`);

                            if (aFieldToWhichICanMove != null) {
                                if (aFieldToWhichICanMove.children[0] == undefined) {
                                    event.target.parentElement.style.backgroundColor = "rgb(68,68,0)";
                                }
                            }

                            uncheckingTheFieldICanMoveTo(aFieldToWhichICanMove, lastMarkedField);
                        }
                    }
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
                movementOfThePlayerPawnFromTheLeftColumn(event.target, isMarkedPawnFromTheFirstColumn);
            } else if (isMarkedPawnFromTheLastColumn) {

            } else {

            }
        })
    })

    isPlayerMovement = false;
}

function getPlayerPawnsFromTheFirstColumn() {
    const howManyRows: number = document.querySelectorAll(".row").length;
    let firstColumnPlayerPawns = [];
    let firstColumnPlayerPawns2 = [];

    for (let i = 0; i < howManyRows; i++) {
        firstColumnPlayerPawns[i] = document.querySelector(`[data-col=c0][data-row=r${i}]`);
        if (firstColumnPlayerPawns[i].children[0] != undefined) {
            if (firstColumnPlayerPawns[i].children[0].className == "pawnPlayer1") {
                firstColumnPlayerPawns2[i] = firstColumnPlayerPawns[i];
            }
        }
    }
    return firstColumnPlayerPawns2;
}

function getPlayerPawnsFromTheLastColumn() {
    const howManyRows: number = document.querySelectorAll(".row").length;
    let lastColumnPlayerPawns = [];
    let lastColumnPlayerPawns2 = [];

    for (let i = 0; i < howManyRows; i++) {
        lastColumnPlayerPawns[i] = document.querySelector(`[data-col=c7][data-row=r${i}]`);
        if (lastColumnPlayerPawns[i].children[0] != undefined) {
            if (lastColumnPlayerPawns[i].children[0].className == "pawnPlayer1") {
                lastColumnPlayerPawns2[i] = lastColumnPlayerPawns[i];
            }
        }
    }
    return lastColumnPlayerPawns2;
}

function changeColorOfFieldICanMoveTo(aFieldToWhichICanMove: HTMLElement | null) {
    if (aFieldToWhichICanMove != null && aFieldToWhichICanMove.children[0] == undefined) {
        aFieldToWhichICanMove.style.backgroundColor = 'rgb(68,68,0)';
    }
}

function moveToFieldToWhichICanMove(aFieldToWhichICanMove: HTMLElement | null, clickedField: EventTarget | null, isMarkedPawnFromTheFirstColumn: boolean) {
    if (aFieldToWhichICanMove != null && clickedField != null) {
        aFieldToWhichICanMove.addEventListener("click", (event) => {
            if (isMarkedPawnFromTheFirstColumn) {
                aFieldToWhichICanMove.appendChild((clickedField as HTMLElement).children[0]);
                aFieldToWhichICanMove.style.backgroundColor = 'rgb(102,102,0)';
            }
        })
    }
}

function movementOfThePlayerPawnFromTheLeftColumn(clickedField: EventTarget | null, isMarkedPawnFromTheFirstColumn: boolean) {
    if (clickedField != null && clickedField instanceof HTMLElement) {
        if (clickedField.className == "pawnPlayer1") {
            clickedField = clickedField.parentElement;
        }
    }

    if (clickedField != null && clickedField instanceof HTMLElement) {
        if (clickedField.dataset.row != undefined && clickedField.dataset.col != undefined) {
            const rowOfFieldToWhichICanMove = Number((clickedField.dataset.row).slice(1)) - 1;
            const colOfFieldToWhichICanMove = Number((clickedField.dataset.col).slice(1)) + 1;

            const aFieldToWhichICanMove: HTMLElement | null = document.querySelector(`[data-col=c${colOfFieldToWhichICanMove}][data-row=r${rowOfFieldToWhichICanMove}]`);

            changeColorOfFieldICanMoveTo(aFieldToWhichICanMove);
            moveToFieldToWhichICanMove(aFieldToWhichICanMove, clickedField, isMarkedPawnFromTheFirstColumn);
        }
    }
}

function uncheckingTheFieldICanMoveTo(aFieldThatICanMoveToAndWantToUncheck: any, lastClickedField: HTMLElement) {
    document.addEventListener("click", (e: Event) => {
        if (e.target != lastClickedField && e.target != lastClickedField.children[0] && e.target != aFieldThatICanMoveToAndWantToUncheck && e.target != aFieldThatICanMoveToAndWantToUncheck.children[0]) {
            aFieldThatICanMoveToAndWantToUncheck.style.backgroundColor = `#666600`;
        }
    })
}

function endOfTheGame(anObjectWithANumberOfPawns: ObjectOfNumbers) {
    if (anObjectWithANumberOfPawns.numberOfPlayerPawns == 0) {
        console.log(`Zwyciężył przeciwnik`);
    } else if (anObjectWithANumberOfPawns.numberOfOpponentPawns == 0) {
        console.log(`Zwyciężył gracz`);
    }
}