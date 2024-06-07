import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";

import {FireModel} from "./models/user.js"
import { FireModels } from "./models/user.js";


const app =express()
app.use(express.json())
app.use(cors({
    origin:["http://localhost:5174"],
    credentials:true
}))
app.use(cookieParser())
const secret = "Satya123";



mongoose.connect("mongodb+srv://satyakarthikvelivela:firescrim123@firescrim.wxzexrz.mongodb.net/registration?retryWrites=true&w=majority&appName=Firescrim")


app.post('/register', (req,res)=> {
    const {name,username,password,freefireid} =req.body;
    const  user = FireModel.findOne({username:username})

    .then(user => {
        if(user){
            res.json("user already exists")
        }
        else{
            FireModel.create(req.body)
            .then (registration => res.json(registration))
            .catch(err => res.json(err)) 
        }
    })

})
app.post("/login", (req,res)=> {
    const  {username,password} = req.body ;
    const data =FireModel.findOne({username: username})
    .then (user => {
        if(user){
            if(user.password === password ){
                res.cookie('username', username ,{maxAge:24*60*60*1000 });
                const free = user.freefireid
                console.log(free)
                res.cookie('freefireid', free ,{maxAge:24*60*60*1000 });
                console.log(req.cookies.username)
                res.json("success")
                
            }
            else {
                res.json("the password is incorrect")
            }
        }
        else{
            res.json("no record exists")
        } 
        
    })
    
  
})


app.post("/payment" ,(req,res) => {
    const {username,freefireid,upiid,status} =req.body;

    FireModels.create(req.body)
    .then (registration => res.json(registration))
    .catch(err => res.json(err))
})
app.get('/api/items', async (req, res) => {
    const cook = req.cookies.username;

    console.log('Request received to /api/items');
    console.log('Cookie:', cook);
    
    if (!cook) {
        console.log('No username cookie found');
        return res.status(400).send('Username cookie not found');
    }

    try {
        const data = await FireModels.find({ username: cook });
        if (!data) {
            console.log('User not found in the database');
            return res.status(404).send('User not found');
        }
        console.log('User data retrieved:', data);
        res.json(data);
    } catch (error) {
        console.error('Database query error:', error);  // Log the error for debugging
        res.status(500).send('Internal Server Error');
    }
});


app.listen(3001, ()=> {
    console.log(("server is running"));
})
