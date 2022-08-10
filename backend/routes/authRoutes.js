const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post("/register", async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password
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

    const user = new User({
        name: name,
        email: email,
        password: passwordHash
    })

    try {
        const newUser = await user.save()
        const token = jwt.sign(
            {
                name: newUser.name,
                id: newUser._id
            },
            "newsecret"
        );

        res.json({ error: null, msg: "User successfully registered!", token: token })
    } catch(error) {
        res.status(400).json({ error })
    }

})

router.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });

    if(!user) {
        return res.status(400).json({ error: "User not found" })
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if(!checkPassword) {
        return res.status(400).json({ error: "Invalid password" })
    }

    const token = jwt.sign(
        {
            name: user.name,
            id: user._id
        },
        "newsecret"
    );

    res.json({ error: null, msg: "User successfully logged in!", token: token })

})

module.exports = router;