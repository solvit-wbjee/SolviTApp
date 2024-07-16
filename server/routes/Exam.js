const express= require('express')

const exam=express.Router()

exam.use(express.json())

exam.get('/add',(req,res)=>{
    res.send('Success')
})

module.exports=exam