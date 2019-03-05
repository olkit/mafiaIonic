var mafiaApp = angular.module('starter.controllers', ['ionic'])
  .controller('AppCtrl', function ($scope, $ionicPopup, $ionicLoading, $state) {

    console.log('MainCtrl started');
    $scope.serverUrl = "http://192.168.0.126:8080";
    $scope.serverUrl = "http://192.168.43.8:8080";
    $scope.serverUrl = "http://137.117.176.32/mafia";
    $scope.serverUrl = "http://185.120.58.251/mafia";
    $scope.serverUrl = "http://127.0.0.1:9999";
    $scope.serverUrl = "http://maflo.net/mafia";

    $scope.auth = {};

    $scope.setServerUrl = function(server) {
      $scope.serverUrl = 'http://' + server;
    };

    $scope.saveAuth = function () {
      localStorage.setItem("authMafia", JSON.stringify($scope.auth));
    };

    $scope.logout = function () {
      localStorage.setItem("authMafia", JSON.stringify({
        isAuth: false,
        userID: "",
        nick: "",
        isMaster: false,
        city: ""
      }));
      $state.go("login");
    };

    $scope.loadAuth = function() {
      $scope.auth = JSON.parse(localStorage.getItem("authMafia"));
      if ($scope.auth === undefined || $scope.auth === null) $scope.auth = {
        isAuth: false,
        isMaster: false,
        userID: "",
        nick: "",
        city: ""
      };
    };
    $scope.loadAuth();


    $scope.popup = function (alert) {
      var alertPopup = $ionicPopup.alert(alert);
      alertPopup.then(function (res) {
      });
    };
    $scope.showLoading = function () {
      $ionicLoading.show({
        template: 'Соеденение с сервером...',
        duration: 7000
      }).then(function () {
      });
    };
    $scope.hideLoading = function () {
      $ionicLoading.hide().then(function () {
      });
    };


    if (!$scope.auth.isAuth) $state.go("login");
  });











