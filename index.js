const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
require('dotenv').config()

const app = express()

//Capturar el body
app.use(bodyparser.urlencoded({
    extended: false
}))
app.use(bodyparser.json())

//Conexion a la base de datos
const url = `mongodb+srv://${process.env.USUARIO}:${process.env.PASSWORD}@cluster0.ocmybsn.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('BD connected')).catch((error) => console.log('Error: ' + error))

//Rutas (creacion e importacion)
const authRoutes = require('./routes/auth')

//ruta del Middleware
app.use('/api/user', authRoutes)

app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'So far... It works!, good thing it didnt explo...'
    })
})

//iniciar Servidor
const PORT = process.env.PORT || 10000
app.listen(PORT, () => {
    console.log(`Servidor en Puerto: ${PORT}`)
})