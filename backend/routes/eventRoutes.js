const router = require("express").Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const verifyToken = require("../helpers/check-token");
const getUserByToken = require("../helpers/get-user-by-token");
const diskStorage = require("../helpers/file-storage");
const Event = require("../models/Event");
const User = require("../models/User");

const upload = multer({ storage: diskStorage });


router.post("/", verifyToken, upload.fields([{ name: "photos" }]), async (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const eventDate = req.body.eventDate;

    let files = [];

    if(req.files) {
        files = req.files.photos;
    }

    if(name == "null" || description == "null" || eventDate == "null") {
        return res.status(400).json({ error: "Please insert, at least, the name, the description and the date of the event." })
    }

    const token = req.header("auth-token");
    const userByToken = await getUserByToken(token);
    const userId = userByToken._id.toString();

    try {
        let photos = [];

        if(files && files.length > 0) {
            files.forEach((photo, i) => {
                photos[i] = photo.path;
            })
        }

        const event = new Event({
            name: name,
            description: description,
            eventDate: eventDate,
            photos: photos,
            private: req.body.private,
            userId: userId
        })

        try {
            const newEvent = await event.save();
            res.json({ error: null, msg: "Event successfully created!", data: newEvent })
        } catch(err) {
            return res.status(400).json({ err })
        }

    } catch(err) {
        return res.status(400).json({ error: "Access denied!" })
    }



})

module.exports = router;