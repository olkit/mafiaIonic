mafiaApp.controller('NightCtrl', function ($scope, $interval, $state, Chats, Game) {

  $scope.gamephase = Game.getGamePhase();


  $scope.volume = 60;
  $scope.playing = false;
  $scope.duration = 0;
  $scope.maxDuration = 1;
  $scope.audioList = ['audio/song_1.mpeg', 'audio/song_2.mpeg', 'audio/song_3.mpeg', 'audio/song_4.mpeg', 'audio/song_5.mpeg'];
  $scope.audioListIndex = 0;
  var audio = new Audio($scope.audioList[$scope.audioListIndex]);

  $scope.playAudio = function () {
    audio.loop = true;
    audio.play();
    $scope.playing = true;
    $scope.maxDuration = audio.duration;
  };
  $scope.pauseAudio = function () {
    audio.pause();
    $scope.playing = false;
  };
  $scope.stopAudio = function () {
    $scope.pauseAudio();
    audio.currentTime = 0;
  };
  $scope.backwardAudio = function () {
    $scope.stopAudio();
    $scope.audioListIndex = ($scope.audioListIndex - 1) % $scope.audioList.length;
    audio = new Audio($scope.audioList[$scope.audioListIndex]);
    $scope.playAudio();
  };
  $scope.forwardAudio = function () {
    $scope.stopAudio();
    $scope.audioListIndex = ($scope.audioListIndex + 1) % $scope.audioList.length;
    audio = new Audio($scope.audioList[$scope.audioListIndex]);
    $scope.playAudio();
  };
  $scope.setVolume = function (volume) {
    audio.volume = volume / 100;
  };
  $scope.setDuration = function (duration) {
    var durationPercent = parseInt(duration);
    audio.currentTime = ($scope.maxDuration / 100) * durationPercent;
  };


  var playingAudio = $interval(function () {
    $scope.duration = parseInt(audio.currentTime / $scope.maxDuration * 100);
  }, 500);


  $scope.progressval = 0;
  var timer = $interval(function () {
    if ($scope.progressval < 0.250) $scope.progressval = 0.0;
    else $scope.progressval -= 0.250;
  }, 250);

  $scope.setTimer = function (time) {
    $scope.progressval = time;
  };

  $scope.$on('$destroy', function () {
    $interval.cancel(playingAudio);
    $interval.cancel(timer);
  });

  $scope.gamers = Chats.all();
  $scope.$on('$ionicView.enter', function () {
    $scope.gamers = Chats.all();
    $scope.gamephase = Game.getGamePhase();
  });
  $scope.lastKilledGamer = null;

  $scope.kill = function (number) {
    if ($scope.gamers.length >= 9 && $scope.lastKilledGamer == null) {
      $scope.lastKilledGamer = Chats.get(number);
      $scope.firstKilled = Chats.get(number);
      Game.setFirstKilled($scope.firstKilled.slot);
    }
    if (Chats.removeSlot(number)) {
      Game.gameDetailNewPhase();
      Game.addGameLog('Убит игрок #' + number);
      Game.setGamerStatus(number, 'KILLED');
      Game.gameDetailSetStatus(number, 'KILLED');
    }
    if (Chats.isGameOver() != null) {
      Game.setDescription(Chats.getMafCount());
      Game.setRoleWin(Chats.isGameOver());
      $state.go('tab.end');
    }
  };
  $scope.missKill = function() {
    Game.gameDetailNewPhase();
    Game.addGameLog('[Ночь] В городе не сострел');
    $state.go('tab.chats');
  };

  $scope.firstKilled = null;
  $scope.bestMove = [];
  $scope.addBestMove = function (number) {
    for (var i = 0; i < $scope.bestMove.length; i++) {
      if ($scope.bestMove[i] === number) {
        $scope.bestMove.splice(i, 1);
      }
    }
    $scope.bestMove.push(number);
    if ($scope.bestMove.length > 3) {
      $scope.bestMove.shift();
    }
    Game.setBestMove($scope.bestMove);
  };

  var speaker = 'zahar';//jane, oksana, alyss и omazh, zahar и ermil
  var emotion = 'evil';//good, evil, neutral
  var speed = '1.0';

  $scope.getAudioUrl = function(text, speaker, emotion, speed) {
    var url = "https://tts.voicetech.yandex.net/generate?text=" + text +
      "&key=af0ee4c4-3f72-4313-a46d-73a43baecf7a" +
      "&format=mp3" +
      "&lang=ru-RU" +
      "&quality=hi" +
      "&speaker=" + speaker +
      "&emotion=" + emotion +
      "&speed=" + speed;
    return url;
  };
  $scope.playText = function(text) {
    var speech = new Audio($scope.getAudioUrl(text, speaker, emotion, speed));
    speech.play();
  };
});
