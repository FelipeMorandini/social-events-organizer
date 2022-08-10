const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const verifyToken = require("../helpers/check-token")
const getUserByToken = require("../helpers/get-user-by-token")

router.get("/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    
    try{
        const user = await User.findOne({ _id: id }, { password: 0 })
        res.json({ error: null, user });
    } catch(error) {
        return res.status(400).json({ error: "User not found!" })
    }

});

router.put("/", verifyToken, async (req, res) => {
    const token = req.header("auth-token");
    const user = await getUserByToken(token);
    const userReqId = req.body.id;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const userId = user._id.toString();

    if(userId != userReqId) {
        res.status(401).json({ error: "User not authorized!" })
    }

    const updateData = {
        username: req.body.name,
        email: req.body.email
    }

    if(password != confirmPassword) {
        res.status(401).json({ error: "Passwords don't match!" })
    } else if(password == confirmPassword && password != null) {
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        updateData.password = passwordHash;
    }

    try {
        const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $set: updateData }, { new: true })
        res.json({ error: null, msg: "User successfully updated!", data: updatedUser })
    } catch(error) {
        res.status(400).json({ error });
    }
})

module.exports = router;