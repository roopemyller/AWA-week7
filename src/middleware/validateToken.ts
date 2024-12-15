import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1]

    if (!token) {
        res.status(401).json({ message: 'Unauthorized: No token provided' })
        return
    }

    jwt.verify(token, process.env.SECRET as string, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: 'Unauthorized: Invalid token' })
            return
        }
        req.user = decoded
        next()
    })
}

export default validateToken
