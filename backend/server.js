require('dotenv').config()
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;
const dbName = 'social-events'
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(
    `mongodb://localhost/${dbName}`
);

app.listen(PORT, () => {
    console.log(`App is running at PORT ${PORT}`);
})