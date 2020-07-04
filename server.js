//Dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

//GLOBALS
const PORT = process.env.PORT || 5000;
const noteController = require('./controllers/notes.js');
const usersController = require('./controllers/users.js')
const db = mongoose.connection;
const MONGODB_URI =
    process.env.MONGODB_URL || 'mongodb://localhost:27017/';

//DATABASE CONNECT
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
db.on('open', () => {
    console.log('Mongo is Connected');
});

//MIDDLEWARE
app.use(cors()); //cors middleware, configured by corsOptions
app.use(express.json());
app.use('/notes/', noteController);
app.use('/users/', usersController);

////Reroute from root to /notes
app.get('/', (req, res) => {
    res.redirect('/notes')
})

//LISTENER
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});