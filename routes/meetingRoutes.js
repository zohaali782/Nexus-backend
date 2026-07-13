const express = require("express");
const router = express.Router();
const {
  scheduleMeeting,
  getMyMeetings,
  updateMeetingStatus,
} = require("../controllers/meetingController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, scheduleMeeting);
router.get("/", protect, getMyMeetings);
router.patch("/:id/status", protect, updateMeetingStatus);

module.exports = router;
