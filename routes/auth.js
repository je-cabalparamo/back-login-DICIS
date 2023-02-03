const router = require('express').Router()
const User = require('../models/User')
const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')
const Jwt = require('jsonwebtoken')

//esquema para validacion del modelo
const validacionRegistro = Joi.object({
    name: Joi.string().max(255).required(),
    apaterno: Joi.string().max(255).required(),
    amaterno: Joi.string().max(255).required(),
    email: Joi.string().max(255).required(),
    password: Joi.string().min(6).max(1024).required()
})

const validacionLogin = Joi.object({
    email: Joi.string().max(255).required(),
    password: Joi.string().min(6).max(1024).required()
})

router.post('/register', async(req, res) => {
    const { error } = validacionRegistro.validate(req.body)
    
    if ( error ) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }
    
    const existeCorreo = await User.findOne({
        email: req.body.email
    })

    if(existeCorreo) {
        return res.status(400).json({
            error: "Email already exists!"
        })
    }

    const salt = await bcrypt.genSalt(10)
    const newpassword = await bcrypt.hash(req.body.password, salt)

    const usuario = new User({
        name: req.body.name,
        apaterno: req.body.apaterno,
        amaterno: req.body.amaterno,
        email: req.body.email,
        password: newpassword
    })
    try {
        const guardado = await usuario.save()
        if (guardado) {
            return res.json ({
                error: null,
                data: guardado
            })
        } else {
            return res.json ({
                error: "Save was unsuccesful"
            })
        }
    } catch (error) {
        return res.json ({
            error
        })
    }
})

router.post('/login', async(req, res) => {
    const { error } = validacionLogin.validate(req.body)
    
    if ( error ) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }
    
    const existeCorreo = await User.findOne({
        email: req.body.email
    })

    if(!existeCorreo) {
        return res.status(400).json({
            error: "Email Wasn't Found!"
        })
    }

    const passwordCorrecto = await bcrypt.compare(req.body.password, existeCorreo.password)
    if (!passwordCorrecto) {
        return res.status(400).json({
            error: "Passwords are Not the Same!"
        })
    }

    const token = Jwt.sign({
        name: existeCorreo.name,
        id: existeCorreo._id
    }, process.env.TOKEN_SECRET)

    res.header('auth-token', token).json({
        error: null,
        data: { token }
    })
})

module.exports = router