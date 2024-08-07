import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";

import {FireModel} from "./models/user.js"
import { FireModels } from "./models/user.js";
import { FireModelss } from "./models/user.js";
import { FireModelsss } from "./models/user.js";


const app =express()
const corsOptions = {
  origin: [ 'https://firescrim.vercel.app','https://firescrim-frontend.vercel.app',"http://localhost:5173","http://localhost:5174","https://firescrim.netlify.app","https://test-umber-kappa-75.vercel.app","https://fire-tau-lac.vercel.app","https://www.firescrim.xyz","https://firescrim.xyz"], // or use '*' to allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials:true,
};
app.use(express.json())
app.use(cors(corsOptions));
app.options('*',cors(corsOptions));
app.use(cookieParser())
const secret = "Satya123";



mongoose.connect("mongodb+srv://satyakarthikvelivela:firescrim123@firescrim.wxzexrz.mongodb.net/registration?retryWrites=true&w=majority&appName=Firescrim")


app.post('/register', (req,res)=> {
    const {name,username,password,freefireid,phoneno} =req.body;
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
                res.cookie('username', username ,{ httpOnly: true, sameSite: 'None',secure:true ,maxAge:24*60*60*1000 });
                const free = user.freefireid
                // console.log(free)
                res.cookie('freefireid', free ,{ httpOnly: true, sameSite: 'None' ,secure:true,maxAge:24*60*60*1000 });
                // console.log(req.cookies.username)
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
    const {username,freefireid,upiid,phoneno,status} =req.body;
    const  user = FireModels.findOne({upiid:upiid})

    .then(user => {
        if(user){
            res.json("The upiid already exists")
        }
        else{
            FireModels.create(req.body)
            .then (registration => res.json(registration))
            .catch(err => res.json(err)) 
        }
    })

})

app.post("/payments",(req,res) => {
    const {username,freefireid,upiid,phoneno,status} =req.body;
    const  user = FireModelss.findOne({upiid:upiid})

    .then(user => {
        if(user){
            res.json("The upiid already exists")
        }
        else{
            FireModelss.create(req.body)
            .then (registration => res.json(registration))
            .catch(err => res.json(err)) 
        }
    })

})
app.post("/paymentss",(req,res) => {
    const {username,freefireid,upiid,phoneno,status} =req.body;
    const  user = FireModelsss.findOne({upiid:upiid})

    .then(user => {
        if(user){
            res.json("The upiid already exists")
        }
        else{
            FireModelsss.create(req.body)
            .then (registration => res.json(registration))
            .catch(err => res.json(err)) 
        }
    })

})
// app.post("/paymentss",(req,res) => {
//     const {username,freefireid,upiid,phoneno,status} =req.body;
//     FireModelsss.create(req.body)
//     .then (registration => res.json(registration))
//     .catch(err => res.json(err))
//     // const  user = FireModelsss.findOne({upiid:upiid})

//     // .then(user => {
//     //     if(user){
//     //         res.json("The upiid already exists")
//     //     }
//     //     else{
//     //         FireModelsss.create(req.body)
//     //         .then (registration => res.json(registration))
//     //         .catch(err => res.json(err)) 
//     //     }
//     // })

// })


app.get('/api/items', async (req, res) => {
    const cook = req.cookies.username;

    // console.log('Request received to /api/items');
    // console.log('Cookie:', cook);


    try {
        const data = await FireModel.find({ username: cook });
        if (!data) {
            // console.log('User not found in the database');
            return res.status(404).send('User not found');
        }
        // console.log('User data retrieved:', data);
        res.json(data);
    } catch (error) {
        // console.error('Database query error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/profile/:username', async (req, res) => {
    const { username } = req.params;
    const { name, freefireid, phoneno } = req.body;

    try {
        const user = await FireModel.findOneAndUpdate(
            { username: username },
            { name, freefireid, phoneno },
            { new: true }
        );
        res.json(user);
    } catch (error) {
        res.status(500).send('Server error');
    }
});


app.get('/items', async (req, res) => {
    const cooks = req.cookies.username;

    // console.log('Cookie:', cooks);


    try {
        const data = await FireModels.find({ username: cooks });
        if (!data) {
            // console.log('User not found in the database');
            return res.status(404).send('User not found');
        }
        // console.log('User data retrieved:', data);
        res.json(data);
    } catch (error) {
        // console.error('Database query error:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/squad', async (req, res) => {
    const cooks = req.cookies.username;

    // console.log('Cookie:', cooks);


    try {
        const data = await FireModelss.find({ username: cooks });
        if (!data) {
            return res.status(404).send('User not found');
        }
        res.json(data);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.get('/duo', async (req, res) => {
    const cooks = req.cookies.username;

    // console.log('Cookie:', cooks);


    try {
        const data = await FireModelsss.find({ username: cooks });
        if (!data) {
            return res.status(404).send('User not found');
        }
        res.json(data);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3001, ()=> {
    console.log(("server is running"));
})
