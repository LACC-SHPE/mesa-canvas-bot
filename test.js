// This is for testing purposes

const canvasAPI = require("./core/canvasAPI")

canvasAPI.fetchAnnouncements().then((announcements) => {
    console.log(announcements)
})