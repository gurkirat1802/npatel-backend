import express from 'express'
import { contactFormController } from '../controllers/contact-controllers.js'

const router = express.Router()

router.post('/contact', contactFormController)

export default router