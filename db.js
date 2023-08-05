const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
console.log("Connected to database");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }
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

const exerciseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: String, required: true }
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

async function saveNewExercise(description, duration, dateStr = null) {
  try {
    let date = new Date();
    if (dateStr) {
      date = new Date(dateStr)
    }
    const newExercise = new Exercise({
      description: description,
      duration: duration,
      date: date.toDateString()
    });
    await newExercise.save();
    return newExercise;
  } catch (error) {
    throw error;
  }
}


module.exports = { User, Exercise, saveNewUser, saveNewExercise };
