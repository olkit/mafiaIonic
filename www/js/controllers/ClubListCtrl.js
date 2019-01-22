mafiaApp.controller('ClubListCtrl', function ($scope, $ionicSideMenuDelegate, $http) {

  $ionicSideMenuDelegate.canDragContent(true);
  $scope.$on('$ionicView.enter', function () {

  });

  $scope.clubList = [];
  $scope.getClubList = function() {
    $http.get($scope.serverUrl + '/api/clubs').then(function(response){
      $scope.clubList = response.data;
    }, function(){});
  };

  $scope.getClubList();
});
