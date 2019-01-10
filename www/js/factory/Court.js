mafiaAppFactory.factory('Court', function () {
  var voted = [];

  return {
    all: function () {
      return voted;
    },
    remove: function (vote) {

      for (var i = 0; i < voted.length; i++) {
        if (voted[i].slot === vote.slot) {
          voted.splice(i, 1);
          return true;
        }
      }
      return false;
    },
    get: function (slot) {
      for (var i = 0; i < voted.length; i++) {
        if (voted[i].slot === parseInt(slot)) {
          return voted[i];
        }
      }
      return null;
    },
    add: function (vote) {
      for (var i = 0; i < voted.length; i++) {
        if (voted[i].slot === parseInt(vote.slot)) {
          return;
        }
      }
      voted.push(vote);
    },
    set: function (newVoted) {
      voted = angular.copy(newVoted);
    },
    vote: function (slot, number) {
      for (var i = 0; i < voted.length; i++) {
        if (voted[i].slot === parseInt(slot)) {
          voted[i].count = number;
        }
      }
    }
  };
});
