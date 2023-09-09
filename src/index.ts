import express from "express";
import { ApolloServer } from 'apollo-server-express'
import path from "path";

import cors from 'cors'
import * as dotenv from 'dotenv'
import morgan from 'morgan'

import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageProductionDefault, ApolloServerPluginLandingPageGraphQLPlayground, } from "apollo-server-core";
import { connectToDb } from "./utils/database";
import { resolvers } from "./resolvers";
import { authChecker } from "./utils/authentication";

var admin = require("firebase-admin");


// setup firebase admmin
var serviceAccount = require("./googleServices.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const start = async ()=> {

    // create express server
    const app = express()

    // get environment variables
    dotenv.config({ path: path.join(__dirname, '.env')})
    // console.log("path.join(__dirname, '.env') ", path.join(__dirname, '.env'));
    

    // connect to db
    connectToDb()

    // allow cross origin requests
    app.use(cors())

    // show dev logs
    app.use(morgan('dev'))

    app.use(express.json())

    console.log("env", process.env.DB_URL)


    // create schema
    const schema = await buildSchema({
        resolvers,
        authChecker,
    })

    // create server
    const server = new ApolloServer({
        schema,
        plugins: [
            // process.env.NODE_ENV === 'production'
            //     ? ApolloServerPluginLandingPageProductionDefault()
            //     : ApolloServerPluginLandingPageGraphQLPlayground()
        ],
        context : ({ req, res, }) => {

            return { req, res, user: req['user'], }
        },
    });

    await server.start()
    server.applyMiddleware({ app, path: '/api' })


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
