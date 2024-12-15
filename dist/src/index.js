"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
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
router.get('/api/user/list', (req, res) => {
    res.status(200).json(users);
});
exports.default = router;
