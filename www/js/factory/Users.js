mafiaAppFactory.factory('Users', function () {
  var users = {
  };

  var tempUser = {
    name: "",
    url: "",
    gameCount: 0
  };

  return {
    all: function () {
      return users;
    },
    addUser: function (user) {
      users[user.name] = user;
    },
    save: function () {
      localStorage.setItem("users", JSON.stringify(users));
},
    load: function () {
      users = JSON.parse(localStorage.getItem("users"));
      if (users === null) users = {};
    }
  };
});
