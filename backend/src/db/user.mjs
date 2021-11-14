import mongoose from 'mongoose';
import { config } from 'dotenv';
import { MONGO_DB_URL } from '../utils/config.mjs';
import mongooseUniqueValidator from 'mongoose-unique-validator';


config();


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    name: String,
    passwordHash: String,
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note'
        }
    ]
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});
userSchema.plugin(mongooseUniqueValidator);

const User = mongoose.model('User', userSchema);


export { User as MongoUser };

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