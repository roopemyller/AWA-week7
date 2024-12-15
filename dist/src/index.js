"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateToken_1 = __importDefault(require("./middleware/validateToken"));
const router = (0, express_1.Router)();
const users = [];
router.post('/api/user/register/', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'No email or password' });
        return;
    }
    const userExists = users.find((user) => user.email === email);
    if (userExists) {
        res.status(403).json({ message: 'Email is already registered' });
        return;
    }
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        const newUser = { email, password: hashedPassword };
        users.push(newUser);
        res.status(200).json(newUser);
        return;
    }
    catch (error) {
        console.log(error);
    }
});
router.post('/api/user/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'No email or password' });
        return;
    }
    try {
        const user = users.find((user) => user.email === email);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ email: user.email }, process.env.SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
        return;
    }
    catch (error) {
        console.log(error);
    }
});
router.get('/api/private', validateToken_1.default, (req, res) => {
    res.status(200).json({ message: 'This is protected secure route!' });
});
router.get('/api/user/list', (req, res) => {
    res.status(200).json(users);
});
exports.default = router;
