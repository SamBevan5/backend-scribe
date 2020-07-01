//Dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

//GLOBALS
const PORT = process.env.PORT || 3000;
const noteController = require('./controllers/notes.js');
const db = mongoose.connection;
const MONGODB_URI =
    process.env.MONGODB_URL || 'mongodb://localhost:27017/notes';

//DUMMY USER
const user = { username: 'SamBevan', password: 'password' };


//DATABASE CONNECT
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
db.on('open', () => {
    console.log('Mongo is Connected');
});

//MIDDLEWARE
app.use(cors()); //cors middleware, configured by corsOptions
app.use(express.json());
app.use('/notes/', noteController);

//LOGIN ROUTE
app.post('/login', async (req, res) => {
    const { username, password } = req.body; //destructure username and password
    //Verify if the right username and password
    if (username === user.username && password === user.password) {
        const token = jwt.sign({ username }, 'secret');
        res.status(200).json(token);
    } else {
        res.status(400).send('WRONG USERNAME OR PASSWORD');
    }
});

////Reroute from root to /restaurants
app.get('/', (req, res) => {
    res.redirect('/notes')
})

//LISTENER
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});