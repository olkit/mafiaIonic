mafiaApp.controller('ChatsCtrl', function ($scope, $interval, $state, $ionicSideMenuDelegate, Chats, Court, Game) {

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
    Game.gameDetailSetStatus(gamer.slot, 'ON_VOTE');

    var vote = {
      slot: gamer.slot,
      count: 0
    };
    Court.add(vote);
  };

  $scope.quit = function(gamer) {
    Game.addGameLog('4 фол - игрок #' + gamer.slot);
    Game.setGamerStatus(gamer.slot, 'QUITED');
    Game.gameDetailSetStatus(gamer.slot, 'QUITED');
    $scope.kill();
  };
  $scope.kick = function(gamer) {
    Game.addGameLog('Дисквал игрок #' + gamer.slot);
    Game.setGamerStatus(gamer.slot, 'KICKED');
    Game.gameDetailSetStatus(gamer.slot, 'KICKED');
    $scope.kill();
  };
  $scope.killed = function(gamer) {
    Game.addGameLog('Убит игрок #' + gamer.slot);
    Game.setGamerStatus(gamer.slot, 'KILLED');
    Game.gameDetailSetStatus(gamer.slot, 'KILLED');
    $scope.kill();
  };

  $scope.kill = function (gamer) {
    if (Chats.remove(gamer)) {
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
    if (gamer.penalty >= 5) $scope.quit(gamer);
  };


  $scope.gameOver = function () {
    $scope.chats = Chats.all();
  };
});
