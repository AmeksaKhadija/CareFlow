import Joi from 'joi';

export const registerSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: ['com', 'net', 'org', 'ma'] } })
        .min(5)
        .max(60)
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required',
        }),
    password: Joi.string()
        .min(8)
        .max(128)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'any.required': 'Password is required',
        }),
    role: Joi.string()
        .valid('patient', 'medecin', 'infirmier', 'secretaire')
        .optional()
        .messages({
            'any.only': 'Role must be one of: patient, medecin, infirmier, secretaire',
        }),
});

export const loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: ['com', 'net', 'org', 'ma'] } })
        .min(5)
        .max(60)
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required',
        }),
    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required',
        }),
});

export const verifyCodeSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: ['com', 'net', 'org', 'ma'] } })
        .required(),
    code: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
            'string.length': 'Verification code must be 6 digits',
            'string.pattern.base': 'Verification code must contain only numbers',
            'any.required': 'Verification code is required',
        }),
});

export const createUserSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: ['com', 'net', 'org', 'ma'] } })
        .required(),
    password: Joi.string()
        .min(8)
        .max(128)
        .required(),
    role: Joi.string()
        .valid('patient', 'medecin', 'infirmier', 'secretaire', 'admin')
        .required(),
    profile: Joi.object({
        firstName: Joi.string().max(50).optional(),
        lastName: Joi.string().max(50).optional(),
        phone: Joi.string().max(20).optional(),
        address: Joi.string().max(200).optional(),
        dateOfBirth: Joi.date().optional(),
        gender: Joi.string().valid('male', 'female', 'other').optional(),
    }).optional(),
});

export const updateUserSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: ['com', 'net', 'org', 'ma'] } })
        .optional(),
    password: Joi.string()
        .min(8)
        .max(128)
        .optional(),
    role: Joi.string()
        .valid('patient', 'medecin', 'infirmier', 'secretaire', 'admin')
        .optional(),
    profile: Joi.object({
        firstName: Joi.string().max(50).optional(),
        lastName: Joi.string().max(50).optional(),
        phone: Joi.string().max(20).optional(),
        address: Joi.string().max(200).optional(),
        dateOfBirth: Joi.date().optional(),
        gender: Joi.string().valid('male', 'female', 'other').optional(),
    }).optional(),
    isActive: Joi.boolean().optional(),
    verified: Joi.boolean().optional(),
}).min(1);

export default { registerSchema, loginSchema, verifyCodeSchema, createUserSchema, updateUserSchema };