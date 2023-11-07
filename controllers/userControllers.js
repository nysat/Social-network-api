const { user, thought } = require('../models');

//api/users
const userController = {
//get all users
getUser(req, res) {
    user.find({})
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

//get a single user by _id and populated thought and friend data
getSingleUser(req, res) {
    user.findOne({ _id: req.params.userId })
      .populate("thoughts")
      .populate("friends")
      .select("-__v")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User find with that ID!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
//create a new user 
createUser(req, res) {
    user.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },


//put to update a user by its _id
updateUser(req, res) {
    user.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User find with this ID!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
//delete to remove user by its _id
deleteUser(req, res) {
    user.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User find with this ID!" })
          : thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: "User and Thought deleted!" }))
      .catch((err) => res.status(500).json(err));
  },


//api/users/:userId/friends/:friendId
// POST to add a new friend to a user's friend list
addFriend(req, res) {
    user.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User find with this ID!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
// DELETE to remove a friend from a user's friend list
deleteFriend(req, res) {
    user.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then(
        (user) =>
          !user
            ? res.status(404).json({ message: "No User find with this ID!" })
            : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = userController;