mafiaApp.controller('LiveGames', function ($scope, $http) {

  $scope.balance = $scope.auth.balance;

  $scope.bets = {
  };

  $scope.liveGames = {
  };




  $scope.incrementBet = function(gameID, amount) {
    $scope.bets[gameID] += amount;
  };

  $scope.clearBet = function(gameID) {
    $scope.bets[gameID] = 0;
  };

  $scope.getRoleName = function(roleID) {
    if(roleID === 'CIVIL') return '';
    if(roleID === 'MAFIA') return 'Мафия';
    if(roleID === 'DON') return 'Дон';
    if(roleID === 'SHERIF') return 'Шериф';
  };

  $scope.getClassCard = function(roleID) {
    if(roleID === 'CIVIL') return 'item-note';
    if(roleID === 'MAFIA') return 'item-note dark';
    if(roleID === 'DON') return 'item-note dark';
    if(roleID === 'SHERIF') return 'item-note energized';
  };

  $scope.updateGame = function(gameID) {
    $http({
      url: $scope.serverUrl + '/api/onlineGames/' + gameID,
      method: "GET",
      timeout: 10000,
      header: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    })
      .then(function (response) {
          if($scope.bets[gameID] === undefined) $scope.bets[gameID] = 100;
          if($scope.liveGames[gameID] === undefined) ;
          $scope.liveGames[gameID] = response.data;
          $scope.liveGames[gameID].gameID = gameID;
        },
        function (response) {
        });
  };


  $scope.getAllLiveGames = function() {
    $http({
      url: $scope.serverUrl + '/api/onlineGames/',
      method: "GET",
      timeout: 10000,
      header: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    })
      .then(function (response) {

          angular.forEach(response.data,  function (value, key) {
            $scope.updateGame(value);
          });
        },
        function (response) {
        });
  };
  $scope.getAllLiveGames();

  //"/onlineGames/{gameID}/bet/{userID}/{amount}")
  $scope.sendGameBet = function(gameID, userID, amount) {
    console.log("Sending bet.. " + gameID + "/" + userID + "/" + amount);
    $http({
      url: $scope.serverUrl + '/api/onlineGames/'+gameID+'/bet/'+userID+'/'+amount,
      method: "POST",
      timeout: 10000,
      header: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    })
      .then(function (response) {
          console.log("Bet amount accepted: " + response.data);
          //update balance
        },
        function (response) {
        });
  };

});
