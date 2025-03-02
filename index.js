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
      res.json({ error: "id unknown" });
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
    let user = await User.findOne({ _id: req.params._id });

    if (!user) {
      res.json({ error: "id unknown" });
      return;
    }

    let exercises = await Exercise
      .find({
        userId: req.params._id,
      })
      .sort({ date: 1 })

    if (req.query.from) {
      let from = new Date(req.query.from);
      exercises = exercises.filter(exercise => {
        date = new Date(exercise.date)
        return date >= from;
      })
    }
    if (req.query.to) {
      let to = new Date(req.query.to);
      exercises = exercises.filter(exercise => {
        date = new Date(exercise.date)
        return date <= to;
      })
    }
    if (req.query.limit) {
      let limit = Number(req.query.limit);
      exercises = exercises.slice(0, limit)
    }

    res.json({
      username: user.username,
      count: exercises.length,
      _id: user._id,
      log: exercises
    });
  } catch (err) {
    console.log(err);
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
