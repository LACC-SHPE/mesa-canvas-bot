const axios = require("axios")

const baseURL = "https://ilearn.laccd.edu"
const endpoint = "/api/v1/announcements"

const params = {
    context_codes: ['256773']
}

const fetchAnnouncements = async () => {
    const promises = []

    return await Promise.all(promises)
}

module.exports = {
    fetchAnnouncements
}