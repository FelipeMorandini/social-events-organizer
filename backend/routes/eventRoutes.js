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

router.get("/allEvents", async (req, res) => {
    try {
        const events = await Event.find({ private: false }).sort([['_id', -1]]);
        res.json({ error: null, events: events })
    } catch(error) {
        return res.status(400).json({ error });
    }
})

router.get('/userEvents', verifyToken, async (req, res) => {
    try {
        const token = req.header("auth-token");
        const user = await getUserByToken(token);
        const userId = user._id.toString();
        const events = await Event.find({ userId: userId });
        
        res.json({ error: null, events: events });
    } catch(error) {
        return res.status(400).json({ error })
    }
})

router.get("/userEvents/:id", verifyToken, async (req, res) => {
    try {
        const token = req.header("auth-token");
        const user = await getUserByToken(token);
        const userId = user._id.toString();
        const eventId = req.params.id;
        const event = await Event.findOne({ _id: eventId, userId: userId })

        res.json({ error: null, event: event })
    } catch(error) {
        return res.status(400).json({ error });
    }
})

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const event = await Event.findOne({ _id: id });

        if(event.private === false) {
            res.json({ error: null, event: event });
        } else {
            const token = req.header("auth-token");
            const user = await getUserByToken(token);
            const userId = user._id.toString();
            const eventUserId = event.userId.toString();

            if(userId == eventUserId) {
                res.json({ error: null, event: event })
            } else {
                res.status(400).json({ error: "Access denied!" })
            }
        }

    } catch(error) {
        return res.status(400).json({ error });
    }
})

router.delete("/", verifyToken, async (req, res) => {
    const token = req.header("auth-token");
    const user = await getUserByToken(token);
    const eventId = req.body.id;
    const userId = user._id.toString();

    try {
        await Party.deleteOne({ _id: eventId, userId: userId });
        res.json({ error: null, msg: "Event successfully removed!" })
    } catch(error) {
        return res.status(400).json({ error: "Access denied!" });
    }
});

router.put("/", verifyToken, upload.fields([{ name: "photos" }]), async (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const eventDate = req.body.eventDate;
    const eventId = req.body.id;
    const eventUserId = req.body.user_id;

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

    if(userId != eventUserId) {
        return res.status(400).json({ error: "Access denied!" })
    }

    const event = {
        id: eventId,
        name: name,
        description: description,
        eventDate: eventDate,
        private: req.body.private,
        userId: userId
    }

    let photos = [];

    if(files && files.length > 0) {
        files.forEach((photo, i) => {
            photos[i] = photo.path;
        })
    }

    event.photos = photos;

    try {
        const updatedEvent = await Event.findOneAndUpdate({ _id: eventId, userId: userId }, {$set: event}, {new: true})
        res.json({ error: null, msg: "Event successfully updated!", data: updatedEvent })
    } catch(error) {
        return res.status(400).json({ error });
    }
})

module.exports = router;