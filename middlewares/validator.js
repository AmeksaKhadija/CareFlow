import Joi from 'joi';

export const registerSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: ['com', 'net'] } }).min(5).max(60).required(),
    password: Joi.string()
        .required()
});

export const loginSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: ['com', 'net'] } }).min(5).max(60).required(),
    password: Joi.string()
        .required()
});


export default { registerSchema, loginSchema };