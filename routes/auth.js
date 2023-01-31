const router = require('express').Router()

router.post('/register', async(req, res) => {
    res.json({
        error: null,
        data: 'And Here is where ill put it'
    })
})

router.get('/register', async(req, res) => {
    res.json({
        error: null,
        data: 'ladies and gentleman, we got it'
    })
})

module.exports = router