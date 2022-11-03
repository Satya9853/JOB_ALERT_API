// enviromment variable
require("dotenv").config();

// catcing async errors
require("express-async-errors");


// Security Packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");


// packages
const express = require("express");
const bodyParser = require("body-parser");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");

const swagger_doc = YAML.load("./swagger.yaml");


// local imports
const connect = require("./db/connect");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const AuthMiddleware = require("./middleware/authentication");
const authRouter = require("./router/auth-router");
const jobRouter = require("./router/jobs-router");


const app = express();

// package middlewares
app.set('trust proxy', 1);
app.use(rateLimit({
    windowMs: 15*60*1000,
    max: 100,
}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(xss());


//Access Controls
app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PATH, DELETE, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();

})

app.get("/", (req, res)=>{
    res.send("<h1>Jobs Api</h1> <a href='/api-docs'> API DOCS </a>");
})

//swagger middleware
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swagger_doc));

// route middlewares
app.use("/api/v1/auth",authRouter);
app.use(AuthMiddleware);
app.use("/api/v1/jobs",jobRouter);


//error handling middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//starting server
const port = process.env.PORT || 3000;
const start = async()=>{
    try{
    await connect(process.env.MONGO_URI);
    app.listen(port, console.log(`server is listening on port ${port}`));
    }catch(error){
        console.log(error);
    }
}

start();