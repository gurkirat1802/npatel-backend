import { psqlFunctionCaller, timeLogger } from "spooky-node"
import { addContactModel } from "../models/contact-models.js"
import { generalResponseModel } from "../models/response-models.js"

export const contactFormController = async (req, res) => {
    try {
        timeLogger({ incident: 'Contact Form Submission' })
        console.log('Contact form submission with payload:', req.body)
        
        const { name, email, subject, message } = req.body

        // Input validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json(generalResponseModel({
                code: 1400,
                msg: "Missing required fields"
            }))
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json(generalResponseModel({
                code: 1400,
                msg: "Invalid email format"
            }))
        }

        // Call database function to store contact form data
        const result = await psqlFunctionCaller(addContactModel({
            name,
            email,
            subject,
            message
        }))

        if (result.rows[0]?.code === 2000) {
            res.status(201).json(generalResponseModel({ 
                code: 2000,
                msg: "Contact form submitted successfully"
            }))
        } else {
            res.status(500).json(generalResponseModel({ 
                code: 1500,
                error: "Failed to submit contact form"
            }))
        }

    } catch (error) {
        console.error('Error in contact form submission:', error)
        res.status(500).json(generalResponseModel({
            code: 1500,
            error: "Internal server error"
        }))
        timeLogger({ incident: 'Contact form submission error' })
    }
}