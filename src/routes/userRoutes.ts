import { Router } from 'express'

export const router = Router()

router.get('/hi', async (req, res) => {
    res.json({ msg: 'Hiiiiooo' })
})
