import CommentModel from "../models/Comment.js";
import PostModel from "../models/Post.js";

export const create = async (req,res) => {
    try {
        const postId = req.params.id
        const doc = new CommentModel({
            text: req.body.text,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            user: req.userId,
            post: postId
        });
        await PostModel.findOneAndUpdate({_id: postId},{$inc: {commentCount: 1}})
        const comment = await doc.save();

        res.json(comment);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать создать комментарий',
        });
    }
}

export const getAllComments = async (req,res) => {
    try {

        const doc = await CommentModel.find().populate('user').exec()
        if (!doc) {
            return res.status(404).json({
                message: 'Комментарии не найден',
            });
        }
        console.log(doc)
        res.json(doc);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить комментарии',
        });
    }
}


export const getCommentByPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await CommentModel.find({post: postId}).populate('user').exec();
        if (!doc) {
            return res.status(404).json({
                message: 'Комментарий не найден',
            });
        }
        console.log(doc)
        res.json(doc);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить комментарий',
        });
    }
};