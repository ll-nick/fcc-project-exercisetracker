const bodyParser = require('body-parser');
const cors = require('cors')
const express = require('express')
require('dotenv').config()

const { User, Exercise, saveNewUser, saveNewExercise } = require('./db');

const app = express()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ====== USERS =======

app.post('/api/users', async (req, res) => {
  try {
    let userExists = await User.findOne({ username: req.body.username });
    if (userExists) {
      res.json({ error: "username already taken" });
      return;
    }

    let newUser = await saveNewUser(req.body.username);
    res.json(newUser);
  } catch (err) {
    console.log(err);
  }
})

app.get('/api/users', async (req, res) => {
  try {
    let users = await User.find();
    res.json(users);
  } catch (err) {
    console.log(err);
  }
})

// ====== EXERCISES =======

app.post('/api/users/:_id/exercises', async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.params._id });

    if (!user) {
      res.json({ error: "id not known" });
      return;
    }

    let newExercise = await saveNewExercise(user._id, req.body.description, req.body.duration, req.body.date);
    res.json({
      username: user.username,
      description: newExercise.description,
      duration: newExercise.duration,
      date: newExercise.date,
      _id: user._id
    });
  } catch (err) {
    console.log(err);
  }
})

app.get('/api/users/:_id/logs', async (req, res) => {
  try {
    let exercises = await Exercise.find({ userId: req.params._id });
    res.json(exercises);
  } catch (err) {
    console.log(err);
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
