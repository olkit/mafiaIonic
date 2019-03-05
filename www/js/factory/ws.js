mafiaAppFactory.service('ws', function () {
  var link = "ws://maflo.net/mafia/ws";
  var socket = new WebSocket(link);
  init(socket);

  function onclose() {
    console.log("WebSocket shutdown requested, normal exit");
    console.log("Reconnecting");
    reconnect();
  }

  function onerror() {
    console.log("WebSocket error");
    console.log("Reconnecting");
    reconnect();
  }

  var onmessage = null;

  function init(socket) {
    socket.onclose = onclose;
    socket.onerror = onerror;
    socket.onmessage = onmessage;
  }

  function reconnect() {
    if (socket == null || socket.readyState == 2 || socket.readyState == 3) {
      console.log("Opening new WebSocket");
      socket = new WebSocket(link);
      init(socket);
    }
  }

  function getSocket() {
    if (socket == null || socket === {}) {
      socket = new WebSocket(link);
    }
    return socket
  }

  return {
    send: function (data) {
      var sock = getSocket();
      console.log("SOCK:");
      console.log(data);
      var message = JSON.stringify(data);
      if (sock.readyState != WebSocket.OPEN) {
        console.log("Tried to send data over closed/ not ready socket");
        setTimeout(function () {
          sock.send(message);
        }, 2000)
      } else {
        sock.send(message);
      }
    },
    setHandler: function (func) {
      onmessage = func;
      init(socket);
    }
  }
});
