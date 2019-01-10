mafiaAppFactory.factory('Chats', function () {

  var liveMafCount = 3;
  var gamers = [{
    slot: 1,
    name: 'Игрок #1',
    lastText: 'Игрок #1',
    face: 'img/max.png',
    role: 'CIVIL',
    status: '',
    penalty: 0,
    mute: false
  }, {
    slot: 2,
    name: 'Игрок #2',
    lastText: 'Игрок #2',
    face: 'img/adam.jpg',
    role: 'CIVIL',
    status: '',
    penalty: 0,
    mute: false
  }, {
    slot: 3,
    name: 'Игрок #3',
    lastText: 'Игрок #3',
    face: 'img/perry.png',
    role: 'CIVIL',
    status: '',
    penalty: 0,
    mute: false
  }, {
    slot: 4,
    name: 'Игрок #4',
    lastText: 'Игрок #4',
    face: 'img/mike.png',
    role: 'CIVIL',
    status: '',
    penalty: 0,
    mute: false
  }, {
    slot: 5,
    name: 'Игрок #5',
    lastText: 'Игрок #5',
    face: 'img/mike.png',
    role: 'CIVIL',
    status: '',
    penalty: 0,
    mute: false
  }, {
    slot: 6,
    name: 'Игрок #6',
    lastText: 'Игрок #6',
    face: 'img/mike.png',
    role: 'CIVIL',
    status: '',
    penalty: 0,
    mute: false
  }, {
    slot: 7,
    name: 'Игрок #7',
    lastText: 'Игрок #7',
    face: 'img/mike.png',
    role: 'CIVIL',
    status: '',
    penalty: 0,
    mute: false
  }, {
    slot: 8,
    name: 'Игрок #8',
    lastText: 'Игрок #8',
    face: 'img/mike.png',
    role: 'CIVIL',
    status: '',
    penalty: 0,
    mute: false
  }, {
    slot: 9,
    name: 'Игрок #9',
    lastText: 'Игрок #9',
    face: 'img/mike.png',
    role: 'CIVIL',
    status: '',
    penalty: 0,
    mute: false
  }, {
    slot: 10,
    name: 'Игрок #10',
    lastText: 'Игрок #10',
    face: 'img/mike.png',
    role: 'CIVIL',
    status: '',
    penalty: 0,
    mute: false
  }];

  return {
    getMafCount: function () {
      return liveMafCount;
    },
    all: function () {
      return gamers;
    },
    remove: function (gamer) {
      var index = gamers.indexOf(gamer);
      if (index !== -1) {
        gamers.splice(index, 1);
        return true;
      }
      return false;
    },
    removeSlot: function (slot) {
      for (var i = 0; i < gamers.length; i++) {
        if (gamers[i].slot === parseInt(slot)) {
          gamers.splice(gamers.indexOf(gamers[i]), 1);
          return true;
        }
      }
      return false;
    },
    get: function (slot) {
      for (var i = 0; i < gamers.length; i++) {
        if (gamers[i].slot === parseInt(slot)) {
          return gamers[i];
        }
      }
      return null;
    },
    set: function (registeredGamers) {
      gamers = angular.copy(registeredGamers);
    },
    updateGamer: function (gamer) {
      for (var i = 0; i < gamers.length; i++) {
        if (gamers[i].slot === gamer.slot) {
          gamers[i] = gamer;
          return;
        }
      }
    },
    flashStatuses: function () {
      for (var i = 0; i < gamers.length; i++) {
        gamers[i].status = '';
      }
    },
    isGameOver: function () {
      var mafiaCount = 0;
      var civilCount = 0;
      for (var i = 0; i < gamers.length; i++) {
        if (gamers[i].role === 'MAFIA' || gamers[i].role === 'DON') mafiaCount++;
        if (gamers[i].role === 'CIVIL' || gamers[i].role === 'SHERIF') civilCount++;
      }
      if (mafiaCount <= 0) {
        liveMafCount = civilCount;
        return 'CIVIL';
      }
      if (mafiaCount >= civilCount) {
        liveMafCount = mafiaCount;
        return 'MAFIA';
      }
      return null;
    }
  };
});
