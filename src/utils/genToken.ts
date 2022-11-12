import jwt from 'jsonwebtoken'

export default function genToken(_id: any): string {
    return jwt.sign({ _id }, process.env.JWT_SEC || 'DevSecString', {
        expiresIn: '30d',
    })
}
