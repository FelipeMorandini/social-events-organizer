const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    photos: {
        type: Array
    },
    private: {
        type: Boolean
    },
    userId: {
        type: mongoose.ObjectId,
        required: true
    }
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;