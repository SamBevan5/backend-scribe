////////////////
/// DEPENDENCIES
////////////////

const express = require('express')
const router = express.Router()
const User = require('../models/users.js')
const jwt = require('jsonwebtoken') // Token for later
const bcrypt = require('bcrypt') //might use for encrypting password
const auth = require('./notes.js')

////////////////
/// ROUTES
////////////////

router.post('/register', async (req,res) => {
    try {
        const {username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({msg: 'You left something out'})
        }
        const isUser = await User.findOne({username: username})
        if (isUser) {
            return res.status(400).json({msg: 'User already exists'})
        }
        const salt = await bcrypt.genSalt()
        const passHash = await bcrypt.hash(password, salt)
        // console.log(passHash)
        const newUser = new User ({
            username, 
            password: passHash
        })
        const savedUser = await newUser.save()
        res.json(savedUser)
    }
    catch (error) {
        res.status(500).json({error: error.message})
    }
})

// Login Route
router.post('/login', async (req,res) => {
    try {
        const {username, password} = req.body
        if (!username || !password) {
            return res.status(400).json({msg: 'You left something out'})
        }
        const user = await User.findOne({ username: username})
        if (!user) 
            return res.status(400).json({msg: "This user doesn't exist"})
        const match = await bcrypt.compare(password, user.password)
        if (!match) return res.status(400).json({msg: "The password doesn't match"})
        const token = jwt.sign({id: user._id, username:user.username}, process.env.jwtSECRET)
        res.json({
            token
            
        })
        // console.log(token)
    }
    catch (error) {
        res.status(500).json({error: error.message})
    }
})


router.post('/validToken', async (req,res) => {
    try {
        const token = req.header('x-auth-token')
        if (!token) return res.json(false)
        const verified = jwt.verify(token, process.env.jwtSECRET)
        if (!verified) return res.json(false)
        const user = await User.findById(verified.id)
        if (!user) return res.json (false)
        return res.json(true)
    }
    catch (error) {
        res.status(500).json({error: error.message})
    }
})

router.get('/', auth, async (req,res) => {
    const user = await User.findById(req.user)
    res.json({
        username: user.username,
        id: user._id
    })
})

module.exports = router