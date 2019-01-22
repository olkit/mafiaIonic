mafiaApp.controller('LoginCtrl', function ($scope, $state, $http, $ionicSideMenuDelegate) {

  $ionicSideMenuDelegate.canDragContent(false);
  $scope.$on('$ionicView.enter', function () {
    $scope.loadAuth();
    if ($scope.auth.isAuth) $state.go("profile");
  });

  $scope.login = function (credentials) {
    $scope.showLoading();
    $http({
      url: $scope.serverUrl + '/api/login',
      method: "POST",
      timeout: 7000,
      header: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      data: credentials
    })
      .then(function (response) {
          // success
          $scope.auth.isAuth = true;
          $scope.auth.userID = response.data.userID;
          $scope.auth.nick = response.data.nickname;
          $scope.auth.city = response.data.city;
          $scope.auth.isMaster = response.data.isMaster;
          $scope.auth.avatar = response.data.avatar;
          $scope.auth.rating = response.data.rating;

          $scope.saveAuth();

          $state.go("profile");
          $scope.hideLoading();
        },
        function (response) { // optional

          $scope.auth.isAuth = false;
          $scope.saveAuth();
          // failed
          $scope.popup({
            title: 'Попробуйте позже!',
            template: 'Не правильный логин или пароль.'
          });
          $scope.hideLoading();
        });
  };
});
