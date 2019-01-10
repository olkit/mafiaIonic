mafiaApp.controller('AccountCtrl', function ($scope, $interval, $state, Chats, Court, Game) {


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
        if (Chats.removeSlot(value.slot)) {
          Game.addGameLog('Уходит игрок #' + value.slot);
          Game.setGamerStatus(value.slot, 'VOTED');
          Game.gameDetailSetStatus(value.slot, 'VOTED');
        }
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
      if (Chats.removeSlot($scope.kickSlot)) {
        Game.addGameLog('Убит игрок #' + $scope.kickSlot);
        Game.setGamerStatus($scope.kickSlot, 'VOTED');
        Game.gameDetailSetStatus($scope.kickSlot, 'VOTED');
      }
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
});
