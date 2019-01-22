mafiaApp.controller('ProfileCtrl', function ($scope, $ionicSideMenuDelegate, $ionicNavBarDelegate, $http) {

  $ionicNavBarDelegate.showBackButton(false);
  $ionicSideMenuDelegate.canDragContent(true);

  $scope.statsFriends = [];
  $scope.statsBestMove = {
    don: {},
    killedCount: 0,
    found0: 0,
    found1: 0,
    found2: 0,
    found3: 0,
    bestMoveFieldMap: {}
  };
  $scope.stats = {
    slots: [],
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

    $http.get($scope.serverUrl + '/api/stats/user/' + $scope.auth.userID + '/slots').then(function(response){
      $scope.stats.slots = response.data;
    }, function(){
    });

    $http.get($scope.serverUrl + '/api/stats/user/' + $scope.auth.userID + '/bestMove').then(function(response){
      $scope.statsBestMove = response.data;
    }, function(){
    });
  };
  $scope.$on('$ionicView.enter', function () {
    $scope.updateProfile();
  });

});
