require('dotenv').config(); // load all env variables
const express = require('express'); // import express
const app = express(); // create an express app instance
const DbConnect = require('./database'); // conencts to DB
const router = require('./routes');
const cors = require('cors');

const corsOption = {
    origin: ['http://localhost:5173']
}

app.use(cors(corsOption));

const PORT = process.env.PORT || 5500; // set server port from (.env) or default to 5500
DbConnect();
app.use(express.json());
app.use(router);

app.get('/', (req, res) => {
    res.send('Hello from express Js');
}); // define a route wd URL nd sending req. when accessed

app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); // this starts server


console.log("Twilio SID:", process.env.SMS_SID);
console.log("Twilio Token:", process.env.SMS_AUTH_TOKEN);
console.log("Twilio Number:", process.env.SMS_AUTH_NUMBER);
