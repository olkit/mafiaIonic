
mafiaApp.controller('EndCtrl', function ($scope, $http, $state, Game, Games) {

  $scope.game = Game.get();
  $scope.$on('$ionicView.enter', function () {
    $scope.game = Game.get();
  });

  $scope.setRoleWin = function (roleID) {
    Game.setRoleWin(roleID);
  };

  $scope.sendServer = function () {
    Game.sendToServerOnlineFinish($scope.game.masterID, $scope.game.roleWin);

    $scope.game.masterID = $scope.auth.userID;
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

    $state.go('games');
  }
});
