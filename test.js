// This is for testing purposes

const canvasAPI = require("./core/canvasAPI")


async function fetchAndLogAnnouncements() {
    try {
        const announcements = await canvasAPI.fetchAnnouncements();
        console.log(announcements);
    } catch (error) {
        console.error('Error fetching announcements:', error);
    }
}

// Call the async function
fetchAndLogAnnouncements();
