import express from "express";
import path from "path";

import cors from 'cors'
import * as dotenv from 'dotenv'
import morgan from 'morgan'

const start = async ()=> {

    // create express server
    const app = express()

    // get environment variables
    dotenv.config({ path: path.join(__dirname, '.env')})
    // console.log("path.join(__dirname, '.env') ", path.join(__dirname, '.env'));
    
    // allow cross origin requests
    app.use(cors())

    // show dev logs
    app.use(morgan('dev'))

    app.use(express.json())

    console.log("env", process.env.DB_URL)


    app.get("/", (_req, res)=> {

        res.json({
            "api": "Phishing Guard",
            running: true
        })
    })


    const PORT = process.env.PORT
    app.listen(PORT, ()=> {

        console.log(`api running on ${PORT}`);
    })
}

start()
