const mongoose = require('mongoose');

const musicSchema = mongoose.Schema({
    id_editor: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    title: String,
    artist: String,
    date_of_creation: Date,
    mp4Url: String,
    likes: [{ type: String }],
  })

const userSchema = mongoose.Schema({
    token: String,
    username: String,
    lastname: String,
    firstname: String,
    password: String,
    music: [musicSchema],
});

const User = mongoose.model('users', userSchema);

module.exports = User;