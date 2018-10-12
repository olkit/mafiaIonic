angular.module('starter.controllers', ['ionic'])
  .controller('AppCtrl', function ($scope, $ionicPopup, $ionicLoading, $state) {

    console.log('MainCtrl started');
    $scope.serverUrl = "http://192.168.0.126:8080";
    $scope.serverUrl = "http://137.117.176.32/mafia";
    $scope.serverUrl = "http://192.168.43.8:8080";
    $scope.serverUrl = "http://127.0.0.1:8080";

    $scope.auth = {};

    $scope.saveAuth = function () {
      localStorage.setItem("authMafia", JSON.stringify($scope.auth));
    };

    $scope.logout = function () {
      localStorage.setItem("authMafia", JSON.stringify({
        isAuth: false,
        userID: "",
        nick: "",
        isMaster: false,
        city: ""
      }));
      $state.go("login");
    };

    $scope.loadAuth = function() {
      $scope.auth = JSON.parse(localStorage.getItem("authMafia"));
      if ($scope.auth === undefined || $scope.auth === null) $scope.auth = {
        isAuth: false,
        isMaster: false,
        userID: "",
        nick: "",
        city: ""
      };
    };
    $scope.loadAuth();


    $scope.popup = function (alert) {
      var alertPopup = $ionicPopup.alert(alert);
      alertPopup.then(function (res) {
      });
    };
    $scope.showLoading = function () {
      $ionicLoading.show({
        template: 'Соеденение с сервером...',
        duration: 7000
      }).then(function () {
      });
    };
    $scope.hideLoading = function () {
      $ionicLoading.hide().then(function () {
      });
    };


    if (!$scope.auth.isAuth) $state.go("login");
  })

  .controller('TabCtrl', function ($scope) {

  })


  .controller('DashCtrl', function ($scope, $state, Chats, Game, Users) {


    $scope.gamers = [];

    Users.load();
    $scope.isDonAvailable = true;
    $scope.isMafiaAvailable = true;
    $scope.isSherifAvailable = true;

    $scope.reorderItem = function (gamer, fromIndex, toIndex) {
      $scope.gamers.splice(fromIndex, 1);
      $scope.gamers.splice(toIndex, 0, gamer);
    };

    $scope.resetInit = function () {
      $scope.gamers = [];
      $scope.isDonAvailable = true;
      $scope.isMafiaAvailable = true;
      $scope.isSherifAvailable = true;
      for (var i = 0; i < 10; i++) {
        var newGamer = {
          slot: i + 1,
          name: "",
          role: "CIVIL",
          lastText: '#' + (i + 1),
          status: '',
          penalty: 0,
          mute: false
        };
        $scope.gamers.push(newGamer);
      }
    };


    $scope.newGame = function (gamers) {
      for(var i = 0; i < gamers.length; i++) {
        var user = {
          name: gamers[i].name,
        };
        Users.addUser(user);
        Users.save();
      }


      Chats.set(gamers);
      Game.setGamers(gamers);
      Game.setStart();
      $state.go('tab.chats');
    };

    $scope.checkRoles = function () {
      var donCount = 0;
      var mafiaCount = 0;
      var sherifCount = 0;
      for (var i = 0; i < 10; i++) {
        if ($scope.gamers[i].role === 'DON') donCount++;
        if ($scope.gamers[i].role === 'MAFIA') mafiaCount++;
        if ($scope.gamers[i].role === 'SHERIF') sherifCount++;
      }
      $scope.isDonAvailable = (donCount < 1);
      $scope.isMafiaAvailable = (mafiaCount < 2);
      $scope.isSherifAvailable = (sherifCount < 1);
    };

    $scope.shuffleGamers = function(gamers) {
      shuffleArray(gamers);

      for(var i = 0; i< gamers.length; i++) {
        gamers[i].slot = i+1;
        gamers[i].lastText = '#' + (i + 1);
      }
    };

    var shuffleArray = function(array) {
      var m = array.length, t, i;

      while (m) {
        i = Math.floor(Math.random() * m--);

        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }

      return array;
    };

    $scope.resetInit();



    $scope.userList = Users.all();
    $scope.activeUserElement = 0;

    $scope.nextSlot = function() {
      $scope.activeUserElement = ($scope.activeUserElement + 1) % $scope.gamers.length;
    };

    $scope.previousSlot = function() {
      $scope.activeUserElement = ($scope.activeUserElement -1 + $scope.gamers.length) % $scope.gamers.length;
    };

    $scope.setUserToActiveSlot = function(user) {
      $scope.gamers[$scope.activeUserElement].id = user.id;
      $scope.gamers[$scope.activeUserElement].name = user.name;
    };
  })

  .controller('ChatsCtrl', function ($scope, $interval, $state, $ionicSideMenuDelegate, Chats, Court, Game) {

    $scope.$on('$ionicView.enter', function () {
      $scope.chats = Chats.all();
    });
    var timer;
    $scope.timerStarted = false;
    $scope.startTimer = function (second) {
      $scope.timerStarted = true;
      $scope.progressval = second;
      timer = $interval(function () {
        $scope.progressval -= 0.250;
      }, 250, second / 0.250);
    };

    $scope.stopTimer = function () {
      $scope.timerStarted = false;
      $interval.cancel(timer);
    };

    $scope.$on('$destroy', function () {
      $scope.stopTimer();
    });

    $scope.onSwipeRight = function (gamer) {
      Chats.updateGamer(gamer);
      var vote = {
        slot: gamer.slot,
        count: 0
      };
      if (gamer.status !== 'participant') {
        gamer.status = 'participant';
        Court.add(vote);
      }
      else {
        gamer.status = '';
        Court.remove(vote);
      }
    };

    $scope.voted = function (gamer) {
      gamer.status = 'participant';
      Chats.updateGamer(gamer);
      Game.addGameLog('Выставлен игрок №' + gamer.slot);

      var vote = {
        slot: gamer.slot,
        count: 0
      };
      Court.add(vote);
    };

    $scope.kill = function (gamer) {
      if (Chats.remove(gamer)) {
        Game.addGameLog('Удален игрок #' + gamer.slot);
        Game.setGamerStatus(gamer.slot, 'KILLED');
      }
      $scope.chats = Chats.all();
      if (Chats.isGameOver() != null) {
        Game.setDescription(Chats.getMafCount());
        Game.setRoleWin(Chats.isGameOver());
        $state.go('tab.end');
      }
    };

    $scope.upPenalty = function (gamer) {
      gamer.penalty++;
      Game.addGameLog('Игрок #' + gamer.slot + ' получил ' + gamer.penalty + ' фол.');
      Game.setGamerPenalty(gamer.slot, gamer.penalty);
      if (gamer.penalty >= 5) $scope.kill(gamer);
    };


    $scope.gameOver = function () {
      $scope.chats = Chats.all();
      //Game.setRoleWin('CIVIL');
      //$state.go('tab.end');
    };
  })

  .controller('AccountCtrl', function ($scope, $interval, $state, Chats, Court, Game) {


    $scope.gamers = Chats.all();
    $scope.$on('$ionicView.enter', function () {
      $scope.voted = Court.all();
      $scope.liveCount = Chats.all().length;
      $scope.participantCount = $scope.voted.length;
      $scope.gamers = Chats.all();
    });
    $scope.voteCount = 0;

    $scope.reVoting = false;
    $scope.voteBalance = [];
    $scope.lastBalance = [];
    $scope.tempbalance = [];
    $scope.kickBalanceVote = 0;
    $scope.kickSlot = 0;
    $scope.kickVoteCount = 0;
    $scope.console = "";

    var timer;
    $scope.timerStarted = false;
    $scope.startTimer = function (second) {
      $scope.timerStarted = true;
      $scope.progressval = second;
      timer = $interval(function () {
        $scope.progressval -= 0.250;
      }, 250, second / 0.250);
    };

    $scope.stopTimer = function () {
      $scope.timerStarted = false;
      $interval.cancel(timer);
    };

    $scope.$on('$destroy', function () {
      $scope.stopTimer();
    });

    $scope.upPenalty = function (gamer) {
      gamer.penalty++;
      Game.addGameLog('Игрок #' + gamer.slot + ' получил ' + gamer.penalty + ' фол.');
      Game.setGamerPenalty(gamer.slot, gamer.penalty);
      if (gamer.penalty >= 5) $scope.kill(gamer);
    };

    $scope.kill = function (gamer) {
      if (Chats.remove(gamer)) {
        Game.addGameLog('Удален игрок #' + gamer.slot);
        Game.setGamerStatus(gamer.slot, 'KILLED');
      }
      $scope.chats = Chats.all();
      if (Chats.isGameOver() != null) {
        Game.setDescription(Chats.getMafCount());
        Game.setRoleWin(Chats.isGameOver());
        $state.go('tab.end');
      }
    };


    $scope.activeVoteSlot = 1;
    $scope.activeSlot = function (vote) {
      $scope.activeVoteSlot = vote.slot;
    };
    $scope.voteNumber = function (number) {

      //kick after автоКатастрофа
      if ($scope.kickBalance) {
        $scope.kickBalanceVote = number;
        return;
      }


      Court.vote($scope.activeVoteSlot, number);
      Game.addGameLog('За игрока №' + $scope.activeVoteSlot + ' проголосовало ' + number + ' игрока.');

      $scope.kickSlot = 0;
      $scope.voteCount = 0;
      angular.forEach($scope.voted, function (value, key) {
        $scope.voteCount += value.count;
      });

      if (($scope.liveCount === $scope.voteCount)) {
        $scope.kickSlot = 0;
        $scope.kickVoteCount = 0;
        angular.forEach($scope.voted, function (value, key) {
          if ($scope.kickVoteCount < value.count) {
            $scope.reVoting = false;
            $scope.kickSlot = value.slot;
            $scope.kickVoteCount = value.count;
          } else if ($scope.kickVoteCount === value.count) {

            $scope.reVoting = true;
            $scope.kickSlot = 0;

            $scope.voteBalance = [];
            angular.forEach($scope.voted, function (value, key) {
              if ($scope.kickVoteCount === value.count) {
                $scope.voteBalance.push({slot: value.slot, count: 0});
              }
            });

            $scope.tempbalance = [];
            if ($scope.voteBalance.length === $scope.lastBalance.length) {
              angular.forEach($scope.voteBalance, function (value, key) {
                $scope.tempbalance.push(value.slot);
              });
              angular.forEach($scope.lastBalance, function (value, key) {
                var index = $scope.tempbalance.indexOf(value.slot);
                if (index !== -1) $scope.tempbalance.splice(index, 1);
              });
              if ($scope.tempbalance.length <= 0) {
                $scope.voteCount = 0;
                $scope.reVoting = false;
                $scope.kickBalance = true;
              }
            }
          }
        });
      } else {
        //Переключение активного слота на следующий
        console.log("Переключение слота голосование......");
        for (var i = 0; i < $scope.voted.length - 1; i++) {
          if ($scope.activeVoteSlot === $scope.voted[i].slot) {
            $scope.activeVoteSlot = $scope.voted[++i].slot;
            break;
          }
        }
        //Если последний голосующий - автомат присвоение голосов
        //bug with loop, if reVote preLast participant
        /*if($scope.voted.length > 0) {
          if ($scope.activeVoteSlot === $scope.voted[$scope.voted.length - 1].slot) {
            $scope.voteNumber($scope.liveCount - $scope.voteCount);
          }
        }*/
      }
    };

    $scope.reVote = function () {
      $scope.clearCourt();
      Court.set($scope.voteBalance);
      $scope.voted = Court.all();
      $scope.voteBalance = [];

      $scope.lastBalance = Court.all();
      if ($scope.voted.length > 0) {
        $scope.activeVoteSlot = $scope.voted[0].slot;
      }

      Game.addGameLog('Переголосование');
    };

    $scope.endBalance = function () {

      Game.addGameLog('Завершение Автокатосторфы: За уход проголосовало ' + $scope.kickBalanceVote + 'игроков');

      if ($scope.liveCount / 2 < $scope.kickBalanceVote) {
        angular.forEach($scope.voteBalance, function (value, key) {
          if (Chats.removeSlot(value.slot)) Game.addGameLog('Уходит игрок #' + value.slot);
        });
      }
      if (Chats.isGameOver() != null) {
        Game.setDescription(Chats.getMafCount());
        Game.setRoleWin(Chats.isGameOver());
        $state.go('tab.end');
      }
      $scope.clearCourt();
    };


    $scope.endCourt = function () {
      Game.addGameLog('Завершение Голосование');
      if ($scope.kickSlot !== 0) {
        if (Chats.removeSlot($scope.kickSlot)) Game.addGameLog('Убит игрок #' + $scope.kickSlot);
        if (Chats.isGameOver() != null) {
          Game.setDescription(Chats.getMafCount());
          Game.setRoleWin(Chats.isGameOver());
          $state.go('tab.end');
        }
      }

      $scope.clearCourt();
    };
    $scope.clearCourt = function () {
      var votes = [];
      Court.set(votes);
      $scope.voted = Court.all();
      $scope.liveCount = Chats.all().length;
      $scope.voteCount = 0;
      $scope.participantCount = $scope.voted.length;
      $scope.kickSlot = 0;
      $scope.kickVoteCount = 0;
      $scope.console = "";
      $scope.reVoting = false;
      $scope.kickBalance = false;
      $scope.kickBalanceVote = 0;
      Chats.flashStatuses();
    }
  })

  .controller('NightCtrl', function ($scope, $interval, $state, Chats, Game) {


    $scope.volume = 60;
    $scope.playing = false;
    $scope.duration = 0;
    $scope.maxDuration = 1;
    $scope.audioList = ['audio/song_1.mpeg', 'audio/song_2.mpeg', 'audio/song_3.mpeg', 'audio/song_4.mpeg', 'audio/song_5.mpeg'];
    $scope.audioListIndex = 0;
    var audio = new Audio($scope.audioList[$scope.audioListIndex]);

    $scope.playAudio = function () {
      audio.loop = true;
      audio.play();
      $scope.playing = true;
      $scope.maxDuration = audio.duration;
    };
    $scope.pauseAudio = function () {
      audio.pause();
      $scope.playing = false;
    };
    $scope.stopAudio = function () {
      $scope.pauseAudio();
      audio.currentTime = 0;
    };
    $scope.backwardAudio = function () {
      $scope.stopAudio();
      $scope.audioListIndex = ($scope.audioListIndex - 1) % $scope.audioList.length;
      audio = new Audio($scope.audioList[$scope.audioListIndex]);
      $scope.playAudio();
    };
    $scope.forwardAudio = function () {
      $scope.stopAudio();
      $scope.audioListIndex = ($scope.audioListIndex + 1) % $scope.audioList.length;
      audio = new Audio($scope.audioList[$scope.audioListIndex]);
      $scope.playAudio();
    };
    $scope.setVolume = function (volume) {
      audio.volume = volume / 100;
    };
    $scope.setDuration = function (duration) {
      var durationPercent = parseInt(duration);
      audio.currentTime = ($scope.maxDuration / 100) * durationPercent;
    };


    var playingAudio = $interval(function () {
      $scope.duration = parseInt(audio.currentTime / $scope.maxDuration * 100);
    }, 500);


    $scope.progressval = 0;
    var timer = $interval(function () {
      if ($scope.progressval < 0.250) $scope.progressval = 0.0;
      else $scope.progressval -= 0.250;
    }, 250);

    $scope.setTimer = function (time) {
      $scope.progressval = time;
    };

    $scope.$on('$destroy', function () {
      $interval.cancel(playingAudio);
      $interval.cancel(timer);
    });

    $scope.gamers = Chats.all();
    $scope.$on('$ionicView.enter', function () {
      $scope.gamers = Chats.all();
    });
    $scope.lastKilledGamer = null;
    $scope.kill = function (number) {
      $scope.lastKilledGamer = Chats.get(number);
      if ($scope.gamers.length === 10) {
        $scope.firstKilled = Chats.get(number);
        Game.setFirstKilled($scope.firstKilled.slot);
      }
      if (Chats.removeSlot(number)) Game.addGameLog('Убит игрок #' + number);
      if (Chats.isGameOver() != null) {
        Game.setDescription(Chats.getMafCount());
        Game.setRoleWin(Chats.isGameOver());
        $state.go('tab.end');
      }
    };

    $scope.firstKilled = null;
    $scope.bestMove = [];
    $scope.addBestMove = function (number) {
      for (var i = 0; i < $scope.bestMove.length; i++) {
        if ($scope.bestMove[i] === number) {
          $scope.bestMove.splice(i, 1);
        }
      }
      $scope.bestMove.push(number);
      if ($scope.bestMove.length > 3) {
        $scope.bestMove.shift();
      }
      Game.setBestMove($scope.bestMove);
    };
  })

  .controller('EndCtrl', function ($scope, $http, Game, Games) {

    $scope.game = Game.get();
    $scope.$on('$ionicView.enter', function () {
      $scope.game = Game.get();
    });

    $scope.setRoleWin = function (roleID) {
      Game.setRoleWin(roleID);
    };

    $scope.sendServer = function () {

      $scope.showLoading();
      $http({
        url: $scope.serverUrl + '/api/game/add',
        method: "POST",
        header: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        data: $scope.game
      })
        .then(function (response) {
            // success
            console.log(response);
            $scope.hideLoading();
          },
          function (response) { // optional
            // failed
            Games.add($scope.game);
            Games.save();
            $scope.popup({
              title: 'Не отправилось на сервер',
              template: 'Сохранено в памяти устройтво. Отправиться позжу'
            });
            $scope.hideLoading();
          });
    }
  })

  .controller('GamesCtrl', function ($scope, $http, Games) {

    $scope.myNick = "olki";

    $scope.gameList = Games.all();
    $scope.$on('$ionicView.enter', function () {
      $scope.myNick = $scope.auth.userID;
      Games.load();
      $scope.gameList = Games.all();
    });

    $scope.updateFromServer = function (nick) {
      $scope.showLoading();
      $scope.myNick = nick;
      $http({
        url: $scope.serverUrl + '/api/game/games',
        method: "GET",
        timeout: 7000,
        header: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      })
        .then(function (response) {
            // success
            $scope.gameList = [];
            angular.forEach(response.data, function (value, key) {
              $scope.updateGame(value);
              $scope.gameList.push(value);
            });

            $scope.hideLoading();
          },
          function (response) { // optional
            // failed
            $scope.popup({
              title: 'Упс!',
              template: 'Не получилось соединиться с серверов.<br/> Олки обновляет сервер.'
            });
            $scope.hideLoading();
          });
    };


    //gamer perspective

    $scope.updateGame = function (game) {
      game.isMyGame = false;
      console.log($scope.myNick);
      for (var i = 0; i < game.gamers.length; i++) {
        if (game.gamers[i].name === $scope.myNick || $scope.myNick === game.gamers[i].userID) {
          game.isMyGame = true;
          game.userinfo = {
            slot: game.gamers[i].slot,
            role: game.gamers[i].role,
            point: game.gamers[i].point,
            penalty: game.gamers[i].penalty,
            status: game.gamers[i].status,
            win: game.gamers[i].win
          };
          break;
        }
      }
    };

    $scope.deleteGameServer = function(game) {
      Games.remove(game);
      Games.save();
    };

    $scope.sendOldGameServer = function(game) {

      $scope.showLoading();
      $http({
        url: $scope.serverUrl + '/api/game/add',
        method: "POST",
        timeout: 10000,
        header: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        data: game
      })
        .then(function (response) {
            // success
          console.log(response);
            //Games.remove(game);
            Games.save();
            $scope.hideLoading();
          },
          function (response) { // optional
            $scope.popup({
              title: 'Упс!',
              template: 'Не получилось соединиться с серверов.<br/> Олки обновляет сервер.'
            });
            $scope.hideLoading();
          });
    };


  })


  .controller('ProfileCtrl', function ($scope, $ionicSideMenuDelegate, $http) {

    $ionicSideMenuDelegate.canDragContent(true);

    $scope.statsFriends = [];
    $scope.stats = {
      "gameCount": 0,
      "winCount": 0,
      "loseCount": 0,
      "donCount": 0,
      "sherifCount": 0,
      "mafiaCount": 0,
      "civilCount": 0,
      "penaltyCount": 0,
      "penaltyAverage": 0,
      "pointCount": 0,
      "winDonCount": 0,
      "loseDonCount": 0,
      "winSherifCount": 0,
      "loseSherifCount": 0,
      "winMafiaCount": 0,
      "loseMafiaCount": 0,
      "winCivilCount": 0,
      "loseCivilCount": 0
    };

    $scope.profile = {
      labels: ["Игр", "Дон", "Шериф", "Мафия", "Мирный", "Фол"],
      data: [
        [
          100.0 * $scope.stats.winCount / ($scope.stats.gameCount === 0 ? 1 : $scope.stats.gameCount),
          100.0 * $scope.stats.winDonCount / ($scope.stats.donCount === 0 ? 1 : $scope.stats.donCount),
          100.0 * $scope.stats.winSherifCount / ($scope.stats.sherifCount === 0 ? 1 : $scope.stats.sherifCount),
          100.0 * $scope.stats.winMafiaCount / ($scope.stats.mafiaCount === 0 ? 1 : $scope.stats.mafiaCount),
          100.0 * $scope.stats.winCivilCount / ($scope.stats.civilCount === 0 ? 1 : $scope.stats.civilCount),
          $scope.stats.penaltyAverage / 0.04
        ]
      ]
    };

    $scope.updateProfile = function() {
      $http.get($scope.serverUrl + '/api/stats/user/' + $scope.auth.userID).then(function(response){
        $scope.stats = response.data;
        $scope.profile = {
          labels: ["Игр", "Дон", "Шериф", "Мафия", "Мирный", "Фол"],
          data: [
            [
              100.0 * $scope.stats.winCount / ($scope.stats.gameCount === 0 ? 1 : $scope.stats.gameCount),
              100.0 * $scope.stats.winDonCount / ($scope.stats.donCount === 0 ? 1 : $scope.stats.donCount),
              100.0 * $scope.stats.winSherifCount / ($scope.stats.sherifCount === 0 ? 1 : $scope.stats.sherifCount),
              100.0 * $scope.stats.winMafiaCount / ($scope.stats.mafiaCount === 0 ? 1 : $scope.stats.mafiaCount),
              100.0 * $scope.stats.winCivilCount / ($scope.stats.civilCount === 0 ? 1 : $scope.stats.civilCount),
              $scope.stats.penaltyAverage / 0.04
            ]
          ]
        };
        $scope.$broadcast('scroll.refreshComplete');
      }, function(){
        $scope.$broadcast('scroll.refreshComplete');
      });
      $http.get($scope.serverUrl + '/api/stats/user/' + $scope.auth.userID + '/friends').then(function(response){
        $scope.statsFriends = response.data;
      }, function(){
      });
    };
    $scope.$on('$ionicView.enter', function () {
      $scope.updateProfile();
    });

  })


  .controller('ClubProfileCtrl', function ($scope, $ionicSideMenuDelegate, $http) {

    $ionicSideMenuDelegate.canDragContent(true);

    $scope.statRating = [];
    $scope.statPenaly = [];
    $scope.statWinrate = [];
    $scope.statWinrateDon = [];
    $scope.statWinrateSherif = [];
    $scope.statWinrateMafia = [];
    $scope.statWinrateCivil = [];

    $scope.getStatRating = function() {
      $http.get($scope.serverUrl + '/api/stats/rating').then(function(response){
        $scope.statRating = response.data;
      }, function(){});
    };
    $scope.getStatPenalty = function() {
      $http.get($scope.serverUrl + '/api/stats/penalty').then(function(response){
        $scope.statPenaly = response.data;
      }, function(){});
    };
    $scope.getStatWinRate = function() {
      $http.get($scope.serverUrl + '/api/stats/winrate').then(function(response){
        $scope.statWinrate = response.data;
      }, function(){});
    };
    $scope.getStatWinRateDon = function() {
      $http.get($scope.serverUrl + '/api/stats/winrate/don').then(function(response){
        $scope.statWinrateDon = response.data;
      }, function(){});
    };
    $scope.getStatWinRateSherif = function() {
      $http.get($scope.serverUrl + '/api/stats/winrate/sherif').then(function(response){
        $scope.statWinrateSherif = response.data;
      }, function(){});
    };
    $scope.getStatWinRateMafia = function() {
      $http.get($scope.serverUrl + '/api/stats/winrate/mafia').then(function(response){
        $scope.statWinrateMafia = response.data;
      }, function(){});
    };
    $scope.getStatWinRateCivil = function() {
      $http.get($scope.serverUrl + '/api/stats/winrate/civil').then(function(response){
        $scope.statWinrateCivil = response.data;
      }, function(){});
    };

    $scope.updateAll = function() {
      $scope.getStatRating();
      $scope.getStatPenalty();
      $scope.getStatWinRate();
      $scope.getStatWinRateDon();
      $scope.getStatWinRateSherif();
      $scope.getStatWinRateMafia();
      $scope.getStatWinRateCivil();
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.$on('$ionicView.enter', function () {
      $scope.updateAll();
    });


  })


  .controller('ClubListCtrl', function ($scope, $ionicSideMenuDelegate, $http) {

    $ionicSideMenuDelegate.canDragContent(true);
    $scope.$on('$ionicView.enter', function () {

    });

    $scope.clubList = [];
    $scope.getClubList = function() {
      $http.get($scope.serverUrl + '/api/clubs').then(function(response){
        $scope.clubList = response.data;
      }, function(){});
    };
  })


  .controller('LiveChat', function ($scope, ws) {


    $scope.state = "REGISTRATION";
    $scope.gamers = {};

    $scope.chatList = [];
    $scope.lastMessage = "";
    $scope.onMessage = function(data) {
      var data = JSON.parse(data.data);

      if(data.message !== undefined) $scope.lastMessage = data.message;
      //$scope.chatList.push(data);
      if(data.type === 'gamer') {
        $scope.gamers[data.payload.slot] = data.payload;
      } else if(data.type === 'state') {
        $scope.state = data.payload;
      }

      $scope.$apply();
    };
    ws.setHandler($scope.onMessage);
    $scope.sendMessage = function(message) {
      ws.send(message);
    };

    $scope.initGamers = function() {
      $scope.gamers = {};
      for(var i = 1; i <= 10; i++) {
        $scope.gamers[i] = {
          slot: i,
          name: "",
          penalty: 0
        };
      }
    };
    $scope.initGamers();





  })

  .controller('LoginCtrl', function ($scope, $state, $http, $ionicSideMenuDelegate) {

    $ionicSideMenuDelegate.canDragContent(false);
    $scope.$on('$ionicView.enter', function () {
      $scope.loadAuth();
      if ($scope.auth.isAuth) $state.go("profile");
    });

    $scope.login = function (credentials) {
      $scope.showLoading();
      $http({
        url: $scope.serverUrl + '/api/login',
        method: "POST",
        timeout: 7000,
        header: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        data: credentials
      })
        .then(function (response) {
            // success
            $scope.auth.isAuth = true;
            $scope.auth.userID = response.data.userID;
            $scope.auth.nick = response.data.nickname;
            $scope.auth.city = response.data.city;
            $scope.auth.isMaster = response.data.isMaster;

            $scope.saveAuth();

            $state.go("profile");
            $scope.hideLoading();
          },
          function (response) { // optional

            $scope.auth.isAuth = false;
            // failed
            $scope.popup({
              title: 'Попробуйте позже!',
              template: 'Не получилось соединиться с серверов.<br/> olki обновляет сервер.'
            });
            $scope.hideLoading();
          });
    };
  });
