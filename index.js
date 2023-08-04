const bodyParser = require('body-parser');
const cors = require('cors')
const express = require('express')
require('dotenv').config()

const { User, saveNewUser } = require('./db');

const app = express()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/users', async (req, res) => {
  try {
    let newUser = await saveNewUser(req.body.username);
    res.json(newUser);
  } catch (err) {
    console.log(err);
  }
})

app.get('/api/users', async (req, res) => {
  try {
    let users = await User.find();
    console.log(users);
    res.json(users);
  } catch (err) {
    console.log(err);
  }
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
