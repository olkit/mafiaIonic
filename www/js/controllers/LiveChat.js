mafiaApp.controller('LiveChat', function ($scope, ws) {


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





});
