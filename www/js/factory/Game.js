mafiaAppFactory.factory('Game', function ($http) {
  var game = {
    phase: 0,
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
    gameDetail: []

  };

  var gamephase = {
    phase: 0,
    '1': 'LIVE',
    '2': 'LIVE',
    '3': 'LIVE',
    '4': 'LIVE',
    '5': 'LIVE',
    '6': 'LIVE',
    '7': 'LIVE',
    '8': 'LIVE',
    '9': 'LIVE',
    '10': 'LIVE'
  };

  var newphase = {
    phase: 0,
    '1': 'LIVE',
    '2': 'LIVE',
    '3': 'LIVE',
    '4': 'LIVE',
    '5': 'LIVE',
    '6': 'LIVE',
    '7': 'LIVE',
    '8': 'LIVE',
    '9': 'LIVE',
    '10': 'LIVE'
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
    setMaster: function (masterID) {
      game.masterID = masterID;
    },
    setClubID: function (clubID) {
      game.clubID = clubID;
    },
    setStop: function (reason) {
      game.isStopped = true;
      game.stoppedReason = reason;
    },
    setStart: function () {
      game.createdTimestamp = new Date().getTime() / 1000;
      var nowDate = new Date(game.createdTimestamp * 1000);
      this.addGameLog('Игра началась ' + nowDate.getHours() + ':' + nowDate.getMinutes());
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
      //if (slot <= 0 || slot >= game.gamers.length) return;
      game.gamers[slot - 1].point = point;
    },
    setGamerPenalty: function (slot, penalty) {
      //if (slot <= 0 || slot > game.gamers.length) return;
      game.gamers[slot - 1].penalty = penalty;
    },
    setGamerStatus: function (slot, status) {
      //if (slot <= 0 || slot > game.gamers.length) return;
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
    },
    getGamePhase:function() {
      return gamephase;
    },
    gameDetailSetStatus: function(slot, status) {
      gamephase[slot] = status;
    },
    gameDetailNewPhase: function() {
      game.gameDetail.push(angular.copy(gamephase));
      gamephase.phase += 1;
      for(var i = 1; i <= 10; i++) {
        if(gamephase[i] === 'ON_VOTE' ||gamephase[i] === 'ON_REVOTE' || gamephase[i] === 'LIVE') gamephase[i] = 'LIVE';
        else gamephase[i] = 'DEAD';
      }
      this.sendToServer(game.masterID);
    },
    sendToServer: function(userID) {
      $http({
        url:'http://mafia.zapto.org:8080/api/onlineGames/' + userID,
        //url:'http://127.0.0.1:8080/api/onlineGames/' + userID,
        method: "POST",
        timeout: 10000,
        header: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        data: game
      })
        .then(function (response) {
            console.log(response);
          },
          function (response) {
          });
    },
    sendToServerOnlineFinish: function(userID, game) {
      $http({
        url:'http://mafia.zapto.org:8080/api/onlineGames/' + userID + '/' + game.roleWin,
        //url:'http://127.0.0.1:8080/api/onlineGames/' + userID + '/' + game.roleWin,
        method: "DELETE",
        timeout: 10000,
        header: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        data: game
      })
        .then(function (response) {
            console.log(response);
          },
          function (response) {
          });
    }

  };
});
