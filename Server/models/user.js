import mongoose  from "mongoose"


const FireSchema = new mongoose.Schema({
    name:String,
    username:String,
    password:String,
    freefireid:String
})

export const FireModel = mongoose.model("Signup", FireSchema)


const FireSchemas = new mongoose.Schema({
    username:String,
    freefireid:String,
    upiid:String,
    status:String
})

export const FireModels = mongoose.model("Transactions", FireSchemas)