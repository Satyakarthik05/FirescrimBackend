import mongoose  from "mongoose"


const FireSchema = new mongoose.Schema({
    name:String,
    username:String,
    password:String,
    freefireid:String,
    phoneno:String
})

export const FireModel = mongoose.model("Signup", FireSchema)


const FireSchemas = new mongoose.Schema({
    username:String,
    freefireid:String,
    upiid:String,
    status:String,
    phoneno:String
})

export const FireModels = mongoose.model("Transactions", FireSchemas)


const  FireSchemass = new mongoose.Schema({
    username:String,
    freefireid:String,
    upiid:String,
    status:String,
    phoneno:String
})

export const FireModelss = mongoose.model("Squadpayment", FireSchemass)