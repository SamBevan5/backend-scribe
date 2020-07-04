const {Schema, model} = require('mongoose')

const userSchema = new Schema({
        username: {type: String, unique: true, required: true},
        password: {type: String, required: true}
})

const User = model('user5', userSchema)

module.exports = User