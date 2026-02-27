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

