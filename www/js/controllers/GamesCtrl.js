mafiaApp.controller('GamesCtrl', function ($scope, $http, Games) {

  $scope.myNick = "";

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
      url: $scope.serverUrl + '/api/game/games/' + $scope.myNick,
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


  $scope.deleteGameOnServer = function(gameID) {
    $http({
      url: $scope.serverUrl + '/api/game',
      method: "DELETE",
      timeout: 10000,
      header: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      data: gameID
    })
  };

  $scope.getClassCard = function(role, isWin) {
    var cardClass = 'item item-avatar';
    if(role === 'MAFIA') cardClass += ' item-dark';
    else if(role === 'DON') cardClass += ' item-dark';
    else if(role === 'SHERIF') cardClass += ' item-energized';
    else if(role === 'CIVIL') cardClass += ' item-assertive';

    if(!isWin) cardClass += ' opacity-60';
    return cardClass;
  };


  $scope.show = 'ALL';

});



