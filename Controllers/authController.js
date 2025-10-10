import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';
import { registerSchema, loginSchema } from '../middlewares/validator.js';
import { doHash, doHashValidation } from '../utils/hashing.js';

const authController = {
    register: async (req, res) => {
        console.log('headers:', req.headers);
        console.log('body type:', typeof req.body);
        console.log('body value:', req.body);

        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({
                success: false,
                message: 'Le corps de la requête doit être un objet JSON (Content-Type: application/json).',
            });
        }

        const { error } = registerSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const msgs = error.details.map(d => d.message);
            return res.status(400).json({ success: false, message: msgs.join(', ') });
        }

        const { email, password } = req.body;

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(401).json({
                    success: false,
                    message: 'Email already exists',
                });
            }

            const hashedPassword = await doHash(password, 12);

            const newUser = new User({ email, password: hashedPassword });
            const result = await newUser.save();

            result.password = undefined;

            return res.status(201).json({
                success: true,
                message: 'User registered successfully',
                result,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const { error, value } = loginSchema.validate({ email, password });
            if (error) {
                const msgs = error.details.map(d => d.message);
                return res.status(400).json({ success: false, message: msgs.join(', ') });
            }
            const existingUser = await User.findOne({ email }).select('+password');
            if (!existingUser) {
                return res.status(401).json({ success: false, message: 'User does not existe!' });
            }
            const result = await doHashValidation(password, existingUser.password);
            if (!result) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
            const token = jwt.sign({
                userId: existingUser._id,
                email: existingUser.email,
                verified: existingUser.verified
            },
                process.env.TOKEN_SECRET
            );
            res.cookie('Authorization', 'Bearer' + token, { exprises: new Date(Date.now() + 8 * 3600000), httpOnly: process.env.NODE_ENV === 'production', secure: process.env.NODE_ENV === 'production' }).json({
                success: true,
                token,
                message: 'User logged in successfully',
            });
        } catch (error) {

        }
    },
};

export default authController;
