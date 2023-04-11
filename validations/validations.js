    import {body} from "express-validator";

    export const registerValidation = [
        body('email','Неверный формат почты').isEmail(),
        body('password','Пароль должен быть не менее 5 символов').isLength({min: 5}),
        body('fullName','Укажите имя').isLength({min: 3}),
        body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL()
    ]

    export const loginValidation = [
        body('email','Неверный формат почты').isEmail(),
        body('password','Пароль должен быть не менее 5 символов').isLength({min: 5}),
    ]

    export const postCreateValidation = [
        body("title","Введите заголовок статьи").isLength({min: 3}).isString(),
        body("text","Введите текст статьи").isLength({min: 3}).isString(),
        body("tags","Неверный формат тегов(укажите массив)").optional().isString(),
        body("imageUrl","Неверная ссылка изображения").optional().isURL()
    ]

    export const commentCreateValidation = [
        body("text","Введите текст статьи").isLength({min: 3}).isString(),

    ]


