
import PostModel from '../models/Post.js';
import CommentModel from "../models/Comment.js";

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec()
        const tags = posts
            .map((obj) => obj.tags)
            .flat()
        

        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить тэги',
        });
    }
};

export const getPostsByTags = async (req,res) => {
    try {
        const tagName = req.params.tagName;
        const doc = await PostModel.find({tags: tagName}).populate('user').exec()
        if (!doc) {
            return res.status(404).json({
                message: "Некорректный запрос"
            })
        }
        res.json(doc)
    } catch (error) {
        console.log(error)
        res.status(404).json({
            message: "Некорректный запрос"
        })
    }

}

export const getPostBySort = async (req,res) => {
    try {
        const sortType = req.params.sortType;
        const posts = await PostModel.find().sort({viewsCount: -1}).populate('user').exec()
        res.json(posts)
    } catch (err) {
        res.status(403).json({
            message: "Не удалось получить статьи"
        })
    }

}
export const getAll = async (req, res) => {
    try {

        const posts = await PostModel.find().populate('user').exec();
        console.log(posts)
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOne({_id: postId}).populate('user').exec( );
                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена',
                    });
                }
        await PostModel.findOneAndUpdate({_id: postId}, {$inc: {viewsCount: 1}})
        res.json(doc);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const remove = async (req, res) => {

    try {
             const post = await PostModel.findOneAndRemove({_id: req.params.id})
             const comments = await CommentModel.deleteMany({post: req.params.id})
        res.status(200).json({success: "true"})
    } catch (err) {
        return res.status(500).json({
            message: "Не удалось удалить статью"
        })
    }

    // try {
    // //     const postId = req.params.id;
    // //
    // //     PostModel.findOneB(
    // //         {
    // //             _id: postId,
    // //         },
    // //         (err, doc) => {
    // //             if (err) {
    // //                 console.log(err);
    // //                 return res.status(500).json({
    // //                     message: 'Не удалось удалить статью',
    // //                 });
    // //             }
    // //
    // //             if (!doc) {
    // //                 return res.status(404).json({
    // //                     message: 'Статья не найдена',
    // //                 });
    // //             }
    // //
    // //             res.json({
    // //                 success: true,
    // //             });
    // //         },
    // //     );
    // // } catch (err) {
    // //     console.log(err);
    // //     res.status(500).json({
    // //         message: 'Не удалось получить статьи',
    // //     });
    // // }
};

// export const remove = async (req, res) => {
//     try {
//         const postId = req.params.id;
//
//         PostModel.findOneAndDelete(
//             {
//                 _id: postId,
//             },
//             (err, doc) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(500).json({
//                         message: 'Не удалось удалить статью',
//                     });
//                 }
//
//                 if (!doc) {
//                     return res.status(404).json({
//                         message: 'Статья не найдена',
//                     });
//                 }
//
//                 res.json({
//                     success: true,
//                 });
//             },
//         );
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             message: 'Не удалось получить статьи',
//         });
//     }
// };

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью',
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags,
            },
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
};
