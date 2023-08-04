const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
console.log("Connected to database");

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true}
});


const User = mongoose.model('User', userSchema);

async function saveNewUser(username) {
    try {
      const newUser = new User({ username: username });
      await newUser.save();
      return newUser;
    } catch (error) {
      throw error;
    }
  }

module.exports = { User, saveNewUser };
