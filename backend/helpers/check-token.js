const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
    const token = req.header("auth-token");

    if(!token) {
        return res.status(401).json({ error: "User not authenticated!" })
    }

    try {
        const verified = jwt.verify(token, "newsecret");
        req.user = verified;
        next()

    } catch(error) {
        res.status(400).json({ error: "Invalid token!" })
    }
}

module.exports = checkToken;