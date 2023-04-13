import express, {json} from 'express'
import cors from 'cors'
import mongoose from "mongoose";
import multer from 'multer'
import dotenv from 'dotenv'
import fs from 'fs'

import {
    registerValidation,
    loginValidation,
    postCreateValidation,
    commentCreateValidation
} from './validations/validations.js'

import checkAuth from "./utils/checkAuth.js";
import user from "./models/User.js";

import * as UserController from './controllers/userController.js'
import * as PostController from './controllers/PostController.js'
import * as CommentController from './controllers/CommentController.js'

dotenv.config({path: ".env"})
mongoose.connect(process.env.MONGODB_URL).then(() => console.log("DB ok")).catch((error) => console.log(error))
const app = express()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});


const upload = multer({ storage });

app.use(cors({origin: true, credentials: true}));
app.use(express.json())
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, UserController.login)
app.post('/auth/register', registerValidation, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload',  upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.post('/upload/avatarUrl', upload.single("image"), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/tags', PostController.getLastTags);
app.get('/tags/:tagName', PostController.getPostsByTags)

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.get('/posts/sort/:sortType',PostController.getPostBySort)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, PostController.update)

app.post('/comments/:id', checkAuth, commentCreateValidation, CommentController.create)
app.get('/posts/comments/:id', CommentController.getCommentByPost)
app.get('/comments', CommentController.getAllComments)

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log("server ok")
})

