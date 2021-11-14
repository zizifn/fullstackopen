import mongoose from 'mongoose';
import { config } from 'dotenv';
import { MONGO_DB_URL } from '../utils/config.mjs';

config();

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minlength: 5,
        required: true
    },
    date: Date,
    important: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Note = mongoose.model('Note', noteSchema);


export { Note as MongoNote };

// const note = new Note({
//     content: 'HTML is Easyddfff',
//     date: new Date(),
//     important: false,
// })
// note.save().then(result => {
//     console.log('note saved!')
//     mongoose.connection.close()
// })

// Note.find({}).then(result => {
//     result.forEach(note => {
//         console.log(note)
//     })
//     mongoose.connection.close()
// })