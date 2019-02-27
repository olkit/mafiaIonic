// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'chart.js'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $ionicConfigProvider.views.maxCache(0);

    $stateProvider
    // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        templateUrl: 'templates/tabs.html',
        controller: 'TabCtrl'
      })

      // Each tab has its own nav history stack:

      .state('tab.dash', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'DashCtrl'
          }
        }
      })

      .state('tab.chats', {
        url: '/chats',
        views: {
          'tab-chats': {
            templateUrl: 'templates/tab-chats.html',
            controller: 'ChatsCtrl'
          }
        }
      })

      .state('tab.account', {
        url: '/account',
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-account.html',
            controller: 'AccountCtrl'
          }
        }
      })

      .state('tab.night', {
        url: '/night',
        views: {
          'tab-night': {
            templateUrl: 'templates/tab-night.html',
            controller: 'NightCtrl'
          }
        }
      })

      .state('tab.end', {
        url: '/end',
        views: {
          'tab-end': {
            templateUrl: 'templates/tab-end.html',
            controller: 'EndCtrl'
          }
        }
      })

      .state('games', {
        url: '/games',
        templateUrl: 'templates/tab-games.html',
        controller: 'GamesCtrl'
      })

      .state('profile', {
        url: '/profile',
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileCtrl'
      })

      .state('club-list', {
        url: '/club-list',
        templateUrl: 'templates/club-list.html',
        controller: 'ClubListCtrl'
      })

      .state('club-profile', {
        url: '/club-profile/:clubID',
        templateUrl: 'templates/club-profile.html',
        controller: 'ClubProfileCtrl'
      })

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

      .state('liveChat', {
        url: '/liveChat',
        templateUrl: 'templates/live-chat.html',
        controller: 'LiveChat'
      })

      .state('about', {
        url: '/about',
        templateUrl: 'templates/about.html'
      })

      .state('settings', {
        url: '/settings',
        templateUrl: 'templates/settings.html'
      })

      .state('liveGames', {
        url: '/live-games',
        templateUrl: 'templates/live-games.html',
        controller: 'LiveGames'
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

  });
