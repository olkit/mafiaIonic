var mafiaAppFactory = angular.module('starter.services', []);

mafiaAppFactory.filter('capitalize', function() {
  return function(input) {
    return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
  }
});
