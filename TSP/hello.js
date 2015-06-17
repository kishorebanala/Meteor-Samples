// On the server,
// it is backed by a MongoDB collection named "cities".

Cities = new Mongo.Collection("cities");

if (Meteor.isClient) {
  Template.leaderboard.helpers({
    cities: function () {
      return Cities.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.leaderboard.events({
    "click .delete": function () {
      Cities.remove(this._id);
    },

    "submit .new-task": function (event) {
      // This function is called when the new task form is submitted
      var text = event.target.text.value;

      Cities.insert({
        name: text,
        createdAt: new Date() // current time
      });

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    }
  });

  Template.city.helpers({
    selected: function () {
      return Session.equals("selectedPlayer", this._id) ? "selected" : '';
    }
  });

  Template.city.events({
    'click': function () {
      Session.set("selectedPlayer", this._id);
    }
  });
}

// On server startup, create some cities if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Cities.find().count() === 0) {
      var names = ["Ada Lovelace", "Grace Hopper", "Marie Curie",
        "Carl Friedrich Gauss", "Nikola Tesla", "Claude Shannon"];
      _.each(names, function (name) {
        Cities.insert({
          name: name,
          score: Math.floor(Random.fraction() * 10) * 5
        });
      });
    }
  });
}