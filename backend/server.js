require('dotenv').config(); // load all env variables

const express = require('express'); // import express
const app = express(); // create an express app instance
const PORT = process.env.PORT || 5500; // set server port from (.env) or default to 5500

app.get('/', (req, res) => {
    res.send('Hello from express Js');
}); // define a route wd URL nd sending req. when accessed

app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); // this start server

