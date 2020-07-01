  const { Schema, model } = require('mongoose');

const noteSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String},
    number: { type: Number, default: 0 },
});

const Note = model('note', noteSchema);

module.exports = Note;