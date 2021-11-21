import { Router } from 'express';
import { MongoNote } from '../db/mongodb.mjs';
import { MongoUser } from '../db/user.mjs';
import { info } from '../utils/logger.mjs';

const notesRouter = Router();

notesRouter.get('/', async (request, res) => {

    MongoNote.find({}).populate('user', { username: 1, name: 1 }).then(
        resp => {
            res.json(resp);
        }
    ).catch(error => {
        res.status(500).send(error);
    });

});

notesRouter.post('/', async (req, res) => {
    if (!req.body.content) {
        res.status(400).send('empty request');
    }

    const user = await MongoUser.findById(req.decodedToken.id);
    const note = new MongoNote({
        content: req.body.content,
        important: req.body.important || false,
        date: new Date(),
        user: user._id
    });
    const savedNote = await note.save();

    user.notes = user.notes.concat(savedNote._id);
    await user.save();

    res.json(savedNote);

});

notesRouter.get('/:id', (req, res, next) => {
    info('test11');
    const id = req.params.id;
    MongoNote.findById(id).then(
        note => {
            if (note) {
                res.json(note);
            } else {
                res.status(404).json({
                    message: `not found ${id}`
                });
            }
        }
    ).catch(
        error => {
            // console.log(error);
            // res.status(400).send(error);
            next(error);
        }
    );
    // res.status(200).json(note);
});

notesRouter.delete('/:id', (req, res, next) => {
    MongoNote.findByIdAndRemove(req.params.id).then(result => {
        // res.status(204).end();
        res.json(result);
    }).catch(next);
});

notesRouter.put('/:id', (req, res, next) => {
    MongoNote.findByIdAndUpdate1(req.params.id, req.body, { new: true }).
        then(
            updatedNote => {
                res.json(updatedNote);
            }
        ).catch(next);
});

export { notesRouter };