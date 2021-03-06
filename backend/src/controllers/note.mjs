import { AuthorizationError } from '../model/error.model.mjs';
import { MongoNote } from '../db/mongodb.mjs';
import { MongoUser } from '../db/user.mjs';
import { Router } from 'express';
import { info } from '../utils/logger.mjs';
const notesRouter = Router();

notesRouter.get('/', async (request, res, next) => {
    const user = await MongoUser.findOne({ userid: request.decodedToken.sub });
    console.log(user);
    if (!user?._id) {
        return next(new AuthorizationError('User not found'));
    }
    // console.log(user._id.toString());
    MongoNote.find({
        'user': user._id.toString()
    })
        .populate('user', { username: 1, name: 1 })
        .then(
            resp => {
                res.json(resp);
            }
        ).catch(error => {
            res.status(500).send(error);
        });

});

notesRouter.post('/', async (req, res) => {
    if (!req.body.content) {
        return res.status(400).send('empty request');
    }
    // eslint-disable-next-line no-useless-catch
    //.findOne({ userid: sub });

    const user = await MongoUser.findOne({ userid: req.decodedToken.sub });
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