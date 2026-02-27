const express = require("express");
const https = require("https");
const fs = require("fs");
const helmet = require("helmet");
const path = require("path");

const app = express();

// SSL Configuration

const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, "cert/server.key")),
    cert: fs.readFileSync(path.join(__dirname, "cert/server.cert"))
};

//Security 

app.use(helmet());

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"], 
            imgSrc: ["'self'", "data:"]
        }
    })
); 

//Core Middleware Setup

app.use(express.json());
app.use(express.static("public"));

//Filler(mock) Data

const feedback = [
{
    id:1,
    project: "Website redesign",
    client: "Client A", 
    freelancer: "Designer B", 
    comment: "Please improve spacing on Homepage", 
    status: "open"
}, 
{
    id: 2, 
    project: "Mobile app UI", 
    client: "Client K", 
    freelancer: "Designer J", 
    comment: "Those colors look great now", 
    status: "resolved"
}]; 

