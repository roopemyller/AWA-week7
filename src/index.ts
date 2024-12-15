import {Request, Response, Router} from "express"
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import validateToken from './middleware/validateToken'

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

router.post('/api/user/login', async (req, res) => {
    const {email, password} = req.body

    if (!email || !password){
        res.status(400).json({message: 'No email or password'})
        return
    }

    try {
        const user = users.find((user) => user.email === email)
        if(!user){
            res.status(404).json({message: 'User not found'})
            return
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            res.status(401).json({message: 'Invalid credentials'})
            return
        }
        const token = jwt.sign({ email: user.email }, process.env.SECRET!, { expiresIn: '1h' })

        res.status(200).json({token})
        return
    } catch (error) {
        console.log(error)
    }
})

router.get('/api/private', validateToken, (req: Request, res: Response) => {
    res.status(200).json({ message: 'This is a protected secure route!' })
})

router.get('/api/user/list', (req, res) => {
    res.status(200).json(users);
})


export default router