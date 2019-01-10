mafiaAppFactory.factory('Games', function () {
  var games = [];

  return {
    all: function () {
      return games;
    },
    add: function (game) {
      games.push(angular.copy(game));
    },
    remove: function (game) {
      var index = games.indexOf(game);
      if (index !== -1) {
        games.splice(index, 1);
      }
    },
    save: function () {
      localStorage.setItem("games", JSON.stringify(games));
    },
    load: function () {
      games = JSON.parse(localStorage.getItem("games"));
    }
  };
});
