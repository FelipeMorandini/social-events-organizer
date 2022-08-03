const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

router.post("/register", async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.email
    const confirmPassword = req.body.confirmPassword

    if(name == null || email == null || password == null || confirmPassword == null) {
        return res.status(400).json({error: "Please check for unsent required fields"});
    }
    if(password != confirmPassword) {
        return res.status(400).json({error: "Provided passwords don't match!"});
    }
    
    const emailExists = await User.findOne({ email: email });

    if(emailExists) {
        return res.status(400).json({error: "Provided e-mail already exists!"});
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    console.log(passwordHash);
})

module.exports = router;