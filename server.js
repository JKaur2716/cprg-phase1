const express = require("express"); 
const https = require("https");
const fs = require("fs");
const helmet = require("helmet");
const path = require("path");

const app = express();

// SSL Configuration

const sslOptions = { //this will hold the certificate settings 
    key: fs.readFileSync(path.join(__dirname, "cert/server.key")), //This will read the private key from the cert folder its like secret password.
    cert: fs.readFileSync(path.join(__dirname, "cert/server.cert")) //This will read hte SSL Certificate file. 
};

//Security 

app.use(helmet()); //This tells to use Helmet's default security protections on every request not just one.

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


//cache enabling for public feedbacks

app.get("/feedback", (req, res) => {
    res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=60");
    res.json(feedback);
})

app.get("/feedback/:id" , (req, res) => {
    const item = feedback.find(f => f.id == req.params.id);

    if (!item) {
        return res.status(404).json({ error: "Feedback not found" });
    }

    res.set("Cache-Control", "public, max-age=300");
    res.json(item);
})

// Create Feedback (No Caching Sensitive)

app.post("/feedback", (req, res) => {
    const newFeedback = {
        id: feedback.length + 1, 
        ...req.body
    };

    feedback.push(newFeedback);

    res.set("cache-control", "no-store");
    res.status(201).json(newFeedback);
});

