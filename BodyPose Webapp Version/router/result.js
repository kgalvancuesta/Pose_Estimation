const express = require('express')

const resultRouter = express.Router()

resultRouter.get('/result', (req,res)=>{
    res.render('result')
})

module.exports = resultRouter
