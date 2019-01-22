mafiaApp.controller('ClubProfileCtrl', function ($scope, $stateParams, $ionicSideMenuDelegate, $http) {

  $ionicSideMenuDelegate.canDragContent(true);

  $scope.clubID = $stateParams.clubID;

  $scope.statRating = [];
  $scope.statPenaly = [];
  $scope.statWinrate = [];
  $scope.statWinrateDon = [];
  $scope.statWinrateSherif = [];
  $scope.statWinrateMafia = [];
  $scope.statWinrateCivil = [];

  $scope.getStatRating = function() {
    $http.get($scope.serverUrl + '/api/stats/club/'+$scope.clubID+'/rating').then(function(response){
      $scope.statRating = response.data;
    }, function(){});
  };
  $scope.getStatPenalty = function() {
    $http.get($scope.serverUrl + '/api/stats/club/'+$scope.clubID+'/penalty').then(function(response){
      $scope.statPenaly = response.data;
    }, function(){});
  };
  $scope.getStatWinRate = function() {
    $http.get($scope.serverUrl + '/api/stats/club/'+$scope.clubID+'/winrate').then(function(response){
      $scope.statWinrate = response.data;
    }, function(){});
  };
  $scope.getStatWinRateDon = function() {
    $http.get($scope.serverUrl + '/api/stats/club/'+$scope.clubID+'/winrate/don').then(function(response){
      $scope.statWinrateDon = response.data;
    }, function(){});
  };
  $scope.getStatWinRateSherif = function() {
    $http.get($scope.serverUrl + '/api/stats/club/'+$scope.clubID+'/winrate/sherif').then(function(response){
      $scope.statWinrateSherif = response.data;
    }, function(){});
  };
  $scope.getStatWinRateMafia = function() {
    $http.get($scope.serverUrl + '/api/stats/club/'+$scope.clubID+'/winrate/mafia').then(function(response){
      $scope.statWinrateMafia = response.data;
    }, function(){});
  };
  $scope.getStatWinRateCivil = function() {
    $http.get($scope.serverUrl + '/api/stats/club/'+$scope.clubID+'/winrate/civil').then(function(response){
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


});
