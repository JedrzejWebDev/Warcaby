// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"main.js":[function(require,module,exports) {
// odpowiednio ponazywać interfejsy
function startGame() {
  var playerPawnsAndOpponentPawns = getPlayerPawnsAndOpponentPawns();
  // const fields : NodeListOf<Element> = document.querySelectorAll(".field");
  var playerFieldsAndOpponentFields = getPlayerFieldsAndOpponentFields();
  var anObjectWithANumberOfPawns = countThePawns(playerPawnsAndOpponentPawns);
  var isPlayerMovement = true;
  var isClickedPawn = false;
  var board = [['', 'YBP', '', 'YBP', '', 'YBP', '', 'YBP'], ['YBP', '', 'YBP', '', 'YBP', '', 'YBP', ''], ['', 'YBP', '', 'YBP', '', 'YBP', '', 'YBP'], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['WRP', '', 'WRP', '', 'WRP', '', 'WRP', ''], ['', 'WRP', '', 'WRP', '', 'WRP', '', 'WRP'], ['WRP', '', 'WRP', '', 'WRP', '', 'WRP', '']];
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
  return {
    playerPawns: playerPawns,
    opponentPawns: opponentPawns
  };
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
  return {
    playerFields: playerFields,
    opponentFields: opponentFields
  };
  // zapisać niektóre rzeczy krócej w tej funkcji przypisując coś do zmiennych
}
function countThePawns(playerPawnsAndOpponentPawns) {
  var numberOfPlayerPawns = playerPawnsAndOpponentPawns.playerPawns.length;
  var numberOfOpponentPawns = playerPawnsAndOpponentPawns.opponentPawns.length;
  var numberOfAllPawns = numberOfPlayerPawns + numberOfOpponentPawns;
  return {
    numberOfPlayerPawns: numberOfPlayerPawns,
    numberOfOpponentPawns: numberOfOpponentPawns,
    numberOfAllPawns: numberOfAllPawns
  };
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
      if (event.currentTarget && event.currentTarget.children[0] != undefined) {
        // istnieje pole i pionek w nim
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
      } else if (isMarkedPawnFromTheLastColumn) {} else {}
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
      var rowOfFieldToWhichICanMove = Number(clickedField.dataset.row.slice(1)) - 1;
      var colOfFieldToWhichICanMove = Number(clickedField.dataset.col.slice(1)) + 1;
      var aFieldToWhichICanMove = document.querySelector("[data-col=c" + colOfFieldToWhichICanMove + "][data-row=r" + rowOfFieldToWhichICanMove + "]");
      console.log(aFieldToWhichICanMove);
    }
  }
}
function uncheckingTheFieldICanMoveTo(aFieldThatICanMoveToAndWantToUncheck, lastClickedField, canIMove) {
  document.addEventListener("click", function (e) {
    if (e.target != lastClickedField && e.target != lastClickedField.children[0] && e.target != aFieldThatICanMoveToAndWantToUncheck && e.target != aFieldThatICanMoveToAndWantToUncheck.children[0]) {
      // I e.target różne od pola na które się ruszyłem (chyba fieldToWhichICanMove). Wtedy będę mógł odkomentować to na dole!!!!! (Mogą pojawić się problemy jak będę się poruszać damką z powrotem na pola na których byłem CHYBA)
      aFieldThatICanMoveToAndWantToUncheck.style.backgroundColor = "#666600";
      canIMove = false;
    }
  });
}
function endOfTheGame(anObjectWithANumberOfPawns) {
  // Usunąć możliwość dalszej gry (dalszego robienia ruchów na obecnej planszy)
  if (anObjectWithANumberOfPawns.numberOfPlayerPawns == 0) {
    console.log("Zwyci\u0119\u017Cy\u0142 przeciwnik");
  } else if (anObjectWithANumberOfPawns.numberOfOpponentPawns == 0) {
    console.log("Zwyci\u0119\u017Cy\u0142 gracz");
  }
}
// Teraz zrobić tak że mogę wykonać ruch tylko wtedy jeśli pole jest podświetlone bo jeżeli odznacze pionek którym mogłem się ruszyć i zaznacze inny i kliknę na pole na które mogłem się poruszyć pionek którym mogłem się przenieść zostanie przeniesiony
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50955" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map