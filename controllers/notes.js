const express = require('express');
const router = express.Router();
const Note = require('../models/notes.js');
const jwt = require('jsonwebtoken');

//AUTH MIDDLEWARE
const auth = async (req, res, next) => {
    //example header => "Authorization":"bearer kdf909sdfsd98f987d"
    const { authorization } = req.headers; //decon auth header
    //check if header is present
    if (authorization) {
        try {
            const token = authorization.split(' ')[1]; //parses token from header
            const payload = jwt.verify(token, 'secret');
            req.user = payload; //puts user data into request object
            next(); //go to the route
        } catch (error) {
            res.status(400).json(error);
        }
    } else {
        res.status(400).send('NO AUTHORIZATION HEADER');
    }
};
//////////////////////////

router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const createdNote = await Note.create(req.body);
        res.status(200).json(createdNote);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const notes = await Note.find({});
        res.status(200).json(notes);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedHNote = await Note.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedNote);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            req.body
        );
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = router;