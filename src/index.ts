import {Request, Response, Router} from "express"
import express from 'express';
import bcrypt from 'bcrypt';

const router: Router = Router()

const users: {email: string, password: string}[] = []

router.post('/api/user/register/', async (req, res) => {
    const {email, password} = req.body

    if (!email || !password){
        res.status(400).json({message: 'No email or password'})
        return
    }

    const userExists = users.find((user) => user.email === email)
    if(userExists){
        res.status(403).json({message: 'Email is already registered'})
        return
    }

    try {
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const newUser = {email, password: hashedPassword}
        users.push(newUser)
        
        res.status(200).json(newUser)
        return
    } catch (error) {
        console.log(error)
    }
})

router.get('/api/user/list', (req, res) => {
    res.status(200).json(users);
});


export default router