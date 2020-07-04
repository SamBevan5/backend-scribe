const { Schema, model } = require('mongoose');

const noteSchema = new Schema({
    title: { type: String, required: true },
    notes: { type: String},
    username: { type: String}
});

const Note = model('note', noteSchema);

module.exports = Note;