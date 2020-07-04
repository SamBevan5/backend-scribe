const express = require('express');
const router = express.Router();
const Note = require('../models/notes.js');
const jwt = require('jsonwebtoken');

//AUTH MIDDLEWARE
const auth = (req, res, next) => {
    try {
        let token = req.headers.authorization
        if (!token) {
            return res.status(401).json({msg: "No token"})
        }
        token = token.split(' ')[1]
        const verified = jwt.verify(token, process.env.jwtSECRET)
        if (!verified) {
            return res.status(401).json({msg: "Not verified"})
        }
        // console.log(verified)
        req.user = verified
        next();
    }   
    catch (error) {
        res.status(500).json({error: error.message})
    }
}
//////////////////////////

router.post('/', auth, async (req, res) => {
    try {
        console.log(req.body);
        const newNote = {...req.body, username: req.user.username}
        const createdNote = await Note.create(newNote);
        res.status(200).json(createdNote);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const notes = await Note.find({username: req.user.username})
        res.status(200).json(notes);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedNote);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.put('/:id', auth, async (req, res) => {
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