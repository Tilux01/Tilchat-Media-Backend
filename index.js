const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const port = process.env.PORT || 5000
const URI = process.env.URI
const cors = require("cors")
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())
const nodemailer = require("nodemailer")
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const upload = multer({ dest: 'uploads/' })
const fs = require ("fs")
const util = require("util")
const { type } = require("os")
const { Resend } = require("resend")
const readFile = util.promisify(fs.readFile);

cloudinary.config({
    cloud_name: process.env.cloudName,
    api_key: process.env.cloudApiKey,
    api_secret: process.env.cloudApiSecret
})

app.get("/ping", (req, res)=>{
    res.status(201).send("OK")
    console.log("pingged");
    
})

app.get("/",(req, res)=>{
    console.log("This is server running for TilChat Meida Upload Backend");
})

app.post("/uploadMedia",upload.single("image"), (req, res, next)=>{
    if (req.file) {
        console.log(req.file);
        readFile(req.file.path)
        .then((buffer)=>{
            console.log(buffer);
            
            const b64 = buffer.toString("base64")
            const data = `data:${req.file.mimetype};base64,${b64}`
            cloudinary.uploader.upload(data,{
                folder: "TilChat",
                resource_type: "auto",
                quality:"auto"
            })
            .then((output)=>{
                imageUrl = output.secure_url
                res.status(201).json({message:imageUrl})
            })
            .catch((error)=>{
                res.status(501).json({message:"Error saving image"})
                console.log(error);
            })
        })
    }
    
})

app.listen(port,(req, res)=>{
    console.log("server running on port", port);
})

