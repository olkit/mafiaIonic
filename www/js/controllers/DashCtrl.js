mafiaApp.controller('DashCtrl', function ($scope, $state, Chats, Game, Users) {


  $scope.gamers = [];

  Users.load();
  $scope.isRating = false;
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
        status: 'live',
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
    Game.setRating($scope.isRating);
    Game.setMaster($scope.auth.userID);
    Game.setClubID($scope.auth.clubID);
    Game.setStart();
    Game.sendToServer($scope.auth.nick);
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

  $scope.setTestGamers = function() {

    $scope.gamers = [
      {slot: 1, name: '1', role: 'CIVIL', status: 'live', penalty: 0, mute: false},
      {slot: 2, name: '2', role: 'MAFIA', status: 'live', penalty: 0, mute: false},
      {slot: 3, name: '3', role: 'CIVIL', status: 'live', penalty: 0, mute: false},
      {slot: 4, name: '4', role: 'DON', status: 'live', penalty: 0, mute: false},
      {slot: 5, name: '5', role: 'CIVIL', status: 'live', penalty: 0, mute: false},
      {slot: 6, name: '6', role: 'CIVIL', status: 'live', penalty: 0, mute: false},
      {slot: 7, name: '7', role: 'SHERIF', status: 'live', penalty: 0, mute: false},
      {slot: 8, name: '8', role: 'CIVIL', status: 'live', penalty: 0, mute: false},
      {slot: 9, name: '9', role: 'MAFIA', status: 'live', penalty: 0, mute: false},
      {slot: 10, name: '0', role: 'CIVIL', status: 'live', penalty: 0, mute: false}
    ];
  }
});
