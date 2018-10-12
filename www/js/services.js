angular.module('starter.services', [])

  .factory('Chats', function () {

    var liveMafCount = 3;
    var gamers = [{
      slot: 1,
      name: 'Игрок #1',
      lastText: 'Игрок #1',
      face: 'img/max.png',
      role: 'CIVIL',
      status: '',
      penalty: 0,
      mute: false
    }, {
      slot: 2,
      name: 'Игрок #2',
      lastText: 'Игрок #2',
      face: 'img/adam.jpg',
      role: 'CIVIL',
      status: '',
      penalty: 0,
      mute: false
    }, {
      slot: 3,
      name: 'Игрок #3',
      lastText: 'Игрок #3',
      face: 'img/perry.png',
      role: 'CIVIL',
      status: '',
      penalty: 0,
      mute: false
    }, {
      slot: 4,
      name: 'Игрок #4',
      lastText: 'Игрок #4',
      face: 'img/mike.png',
      role: 'CIVIL',
      status: '',
      penalty: 0,
      mute: false
    }, {
      slot: 5,
      name: 'Игрок #5',
      lastText: 'Игрок #5',
      face: 'img/mike.png',
      role: 'CIVIL',
      status: '',
      penalty: 0,
      mute: false
    }, {
      slot: 6,
      name: 'Игрок #6',
      lastText: 'Игрок #6',
      face: 'img/mike.png',
      role: 'CIVIL',
      status: '',
      penalty: 0,
      mute: false
    }, {
      slot: 7,
      name: 'Игрок #7',
      lastText: 'Игрок #7',
      face: 'img/mike.png',
      role: 'CIVIL',
      status: '',
      penalty: 0,
      mute: false
    }, {
      slot: 8,
      name: 'Игрок #8',
      lastText: 'Игрок #8',
      face: 'img/mike.png',
      role: 'CIVIL',
      status: '',
      penalty: 0,
      mute: false
    }, {
      slot: 9,
      name: 'Игрок #9',
      lastText: 'Игрок #9',
      face: 'img/mike.png',
      role: 'CIVIL',
      status: '',
      penalty: 0,
      mute: false
    }, {
      slot: 10,
      name: 'Игрок #10',
      lastText: 'Игрок #10',
      face: 'img/mike.png',
      role: 'CIVIL',
      status: '',
      penalty: 0,
      mute: false
    }];

    return {
      getMafCount: function () {
        return liveMafCount;
      },
      all: function () {
        return gamers;
      },
      remove: function (gamer) {
        var index = gamers.indexOf(gamer);
        if (index !== -1) {
          gamers.splice(index, 1);
          return true;
        }
        return false;
      },
      removeSlot: function (slot) {
        for (var i = 0; i < gamers.length; i++) {
          if (gamers[i].slot === parseInt(slot)) {
            gamers.splice(gamers.indexOf(gamers[i]), 1);
            return true;
          }
        }
        return false;
      },
      get: function (slot) {
        for (var i = 0; i < gamers.length; i++) {
          if (gamers[i].slot === parseInt(slot)) {
            return gamers[i];
          }
        }
        return null;
      },
      set: function (registeredGamers) {
        gamers = angular.copy(registeredGamers);
      },
      updateGamer: function (gamer) {
        for (var i = 0; i < gamers.length; i++) {
          if (gamers[i].slot === gamer.slot) {
            gamers[i] = gamer;
            return;
          }
        }
      },
      flashStatuses: function () {
        for (var i = 0; i < gamers.length; i++) {
          gamers[i].status = '';
        }
      },
      isGameOver: function () {
        var mafiaCount = 0;
        var civilCount = 0;
        for (var i = 0; i < gamers.length; i++) {
          if (gamers[i].role === 'MAFIA' || gamers[i].role === 'DON') mafiaCount++;
          if (gamers[i].role === 'CIVIL' || gamers[i].role === 'SHERIF') civilCount++;
        }
        if (mafiaCount <= 0) {
          liveMafCount = civilCount;
          return 'CIVIL';
        }
        if (mafiaCount >= civilCount) {
          liveMafCount = mafiaCount;
          return 'MAFIA';
        }
        return null;
      }
    };
  })

  .factory('Court', function () {
    var voted = [];

    return {
      all: function () {
        return voted;
      },
      remove: function (vote) {

        for (var i = 0; i < voted.length; i++) {
          if (voted[i].slot === vote.slot) {
            voted.splice(i, 1);
            return true;
          }
        }
        return false;
      },
      get: function (slot) {
        for (var i = 0; i < voted.length; i++) {
          if (voted[i].slot === parseInt(slot)) {
            return voted[i];
          }
        }
        return null;
      },
      add: function (vote) {
        for (var i = 0; i < voted.length; i++) {
          if (voted[i].slot === parseInt(vote.slot)) {
            return;
          }
        }
        voted.push(vote);
      },
      set: function (newVoted) {
        voted = angular.copy(newVoted);
      },
      vote: function (slot, number) {
        for (var i = 0; i < voted.length; i++) {
          if (voted[i].slot === parseInt(slot)) {
            voted[i].count = number;
          }
        }
      }
    };
  })


  .factory('Game', function () {
    var game = {
      roleWin: 'CIVIL',
      firstKilled: 0,
      bestPoints: 0.0,
      bestMove: [],
      isRating: false,
      isStopped: false,
      stoppedReason: 'none',
      createdTimestamp: 0,
      duration: 0.0,
      description: '',
      comment: '',
      gamers: [
        {
          gamerID: '',
          slot: 1,
          name: '',
          role: 'CIVIL',
          penalty: 0,
          point: 0,
          status: 'live'
        }, {
          gamerID: '',
          slot: 2,
          name: '',
          role: 'CIVIL',
          penalty: 0,
          point: 0,
          status: 'live'
        }, {
          gamerID: '',
          slot: 3,
          name: '',
          role: 'CIVIL',
          penalty: 0,
          point: 0,
          status: 'live'
        }, {
          gamerID: '',
          slot: 4,
          name: '',
          role: 'CIVIL',
          penalty: 0,
          point: 0,
          status: 'live'
        }, {
          gamerID: '',
          slot: 5,
          name: '',
          role: 'CIVIL',
          penalty: 0,
          point: 0,
          status: 'live'
        }, {
          gamerID: '',
          slot: 6,
          name: '',
          role: 'CIVIL',
          penalty: 0,
          point: 0,
          status: 'live'
        }, {
          gamerID: '',
          slot: 7,
          name: '',
          role: 'MAFIA',
          penalty: 0,
          point: 0,
          status: 'live'
        }, {
          gamerID: '',
          slot: 8,
          name: '',
          role: 'SHERIF',
          penalty: 0,
          point: 0,
          status: 'live'
        }, {
          gamerID: '',
          slot: 9,
          name: '',
          role: 'MAFIA',
          penalty: 0,
          point: 0,
          status: 'live'
        }, {
          gamerID: '',
          slot: 10,
          name: '',
          role: 'DON',
          penalty: 0,
          point: 0,
          status: 'live'
        }
      ],
      gameLog: [],
      gameDetail: [
        {
          phase: 0,
          slot1: 'PARTICIPANT',
          slot2: 'KILLED',
          slot3: 'KICKED',
          slot4: 'VOTED',
          slot5: 'LEFT',
          slot6: 'LEFT',
          slot7: 'LEFT',
          slot8: 'LEFT',
          slot9: 'LEFT',
          slot10: 'LEFT'
        }
      ]

    };


    return {
      get: function () {
        return game;
      },
      setGamers: function (gamers) {
        game.gamers = angular.copy(gamers);
        this.addGameLog('Добавлены новые игроки');
      },
      setRoleWin: function (roleID) {
        this.addGameLog('Победа ' + roleID);
        game.roleWin = roleID;
        this.calculatePoint();
        this.setFinish();
      },
      setFirstKilled: function (slot) {
        game.firstKilled = slot;
        this.addGameLog('Первый убиенный игрок #' + slot);
      },
      setBestMove: function (bestMoveArray) {
        game.bestMove = bestMoveArray;
        if (game.bestMove.length >= 3) this.addGameLog('Лучший ход игрока ' + game.bestMove);
      },
      setRating: function (isRating) {
        game.isRating = isRating;
      },
      setStop: function (reason) {
        game.isStopped = true;
        game.stoppedReason = reason;
      },
      setStart: function () {
        game.createdTimestamp = new Date().getTime() / 1000;
        this.addGameLog('Игра началась ' + new Date(game.createdTimestamp * 1000));
      },
      setFinish: function () {
        game.duration = new Date().getTime() / 1000 - game.createdTimestamp;
        this.addGameLog('Игра завершена. Длительность ' + game.duration + 'с.');
      },
      addGameDetail: function (gameDetail) {
        game.gameDetail.push(gameDetail);
      },
      calculatePoint: function () {

        this.addGameLog('Подсчет очков.');
        //WINNERS +1
        var winnerCount = 0;
        for (var i = 0; i < game.gamers.length; i++) {
          game.gamers[i].point = 0.0;
          if (game.gamers[i].role === game.roleWin) {
            game.gamers[i].point = 1.0;
            winnerCount++;
          } else if (game.roleWin == 'MAFIA' && game.gamers[i].role == 'DON') {
            game.gamers[i].point = 1.0;
            winnerCount++;
          } else if (game.roleWin == 'CIVIL' && game.gamers[i].role == 'SHERIF') {
            game.gamers[i].point = 1.0;
            winnerCount++
          }

          if (game.gamers[i].penalty >= 5) game.gamers[i].point -= 0.5;
        }
        //FIRST KILL - BEST MOVE
        var mafCount = 0;
        if (game.bestMove[i] !== 0) {
          for (var i = 0; i < game.bestMove.length; i++) {
            if (game.gamers[game.bestMove[i] - 1].role === 'MAFIA' || game.gamers[game.bestMove[i] - 1].role === 'DON') {
              mafCount++;
            }
          }
        }
        if (game.firstKilled !== 0) {
          if (game.gamers[game.firstKilled - 1].role !== 'MAFIA' && game.gamers[game.firstKilled - 1].role !== 'DON') {
            if (mafCount >= 3) {
              game.gamers[game.firstKilled - 1].point += 0.4;
              game.bestPoints = 0.4;
            } else if (mafCount >= 2) {
              game.gamers[game.firstKilled - 1].point += 0.25;
              game.bestPoints = 0.25;
            }
          }
        }
        //PENALTY POINTS FOR 4 penalty

      },
      setGamerPoint: function (slot, point) {
        if (slot <= 0 || slot >= game.gamers.length) return;
        game.gamers[slot - 1].point = point;
      },
      setGamerPenalty: function (slot, penalty) {
        if (slot <= 0 || slot > game.gamers.length) return;
        game.gamers[slot - 1].penalty = penalty;
      },
      setGamerStatus: function (slot, status) {
        if (slot <= 0 || slot > game.gamers.length) return;
        game.gamers[slot - 1].status = status;
      },
      addGameLog: function (text) {
        game.gameLog.push(text);
      },
      getGameLog: function () {
        return game.gameLog;
      },
      setComment: function (comment) {
        game.comment = angular.copy(comment);
      },
      setDescription: function (description) {
        game.description = angular.copy(description);
      }

    };
  })


  .factory('Games', function () {
    var games = [];

    return {
      all: function () {
        return games;
      },
      add: function (game) {
        games.push(angular.copy(game));
      },
      remove: function (game) {
        var index = games.indexOf(game);
        if (index !== -1) {
          games.splice(index, 1);
        }
      },
      save: function () {
        localStorage.setItem("games", JSON.stringify(games));
      },
      load: function () {
        games = JSON.parse(localStorage.getItem("games"));
      }
    };
  })

  .factory('Users', function () {
    var users = {
      "olki": {
        name: "olki"
      }
    };

    var tempUser = {
      name: "olki",
      url: "",
      gameCount: 0
    };

    return {
      all: function () {
        return users;
      },
      addUser: function (user) {
        users[user.name] = user;
      },
      save: function () {
        localStorage.setItem("users", JSON.stringify(users));
      },
      load: function () {
        users = JSON.parse(localStorage.getItem("users"));
        if (users === null) users = {};
      }
    };
  })

  .service('ws', function () {
    var link = "ws://127.0.0.1:8080/ws";
    var socket = new WebSocket(link);
    init(socket);

    function onclose() {
      console.log("WebSocket shutdown requested, normal exit");
      console.log("Reconnecting");
      reconnect();
    }

    function onerror() {
      console.log("WebSocket error");
      console.log("Reconnecting");
      reconnect();
    }

    var onmessage = null;

    function init(socket) {
      socket.onclose = onclose;
      socket.onerror = onerror;
      socket.onmessage = onmessage;
    }

    function reconnect() {
      if (socket == null || socket.readyState == 2 || socket.readyState == 3) {
        console.log("Opening new WebSocket");
        socket = new WebSocket(link);
        init(socket);
      }
    }

    function getSocket() {
      if (socket == null || socket === {}) {
        socket = new WebSocket(link);
      }
      return socket
    }

    return {
      send: function (data) {
        var sock = getSocket();
        console.log("SOCK:");
        console.log(data);
        var message = JSON.stringify(data);
        if (sock.readyState != WebSocket.OPEN) {
          console.log("Tried to send data over closed/ not ready socket");
          setTimeout(function () {
            sock.send(message);
          }, 2000)
        } else {
          sock.send(message);
        }
      },
      setHandler: function (func) {
        onmessage = func;
        init(socket);
      }
    }
  });
;

