const Meeting = require("../models/Meeting");

// SCHEDULE a new meeting
const scheduleMeeting = async (req, res) => {
  try {
    const { participant, title, description, startTime, endTime } = req.body;
    const organizer = req.user.id; // comes from auth middleware

    // Conflict detection: check organizer's existing meetings
    const conflict = await Meeting.findOne({
      $or: [{ organizer }, { participant: organizer }],
      status: { $in: ["pending", "accepted"] },
      $and: [
        { startTime: { $lt: new Date(endTime) } },
        { endTime: { $gt: new Date(startTime) } },
      ],
    });

    if (conflict) {
      return res
        .status(400)
        .json({
          message: "You already have a meeting scheduled in this time slot",
        });
    }

    const meeting = await Meeting.create({
      organizer,
      participant,
      title,
      description,
      startTime,
      endTime,
    });

    res
      .status(201)
      .json({ message: "Meeting scheduled successfully", meeting });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET all meetings for logged-in user
const getMyMeetings = async (req, res) => {
  try {
    const userId = req.user.id;
    const meetings = await Meeting.find({
      $or: [{ organizer: userId }, { participant: userId }],
    })
      .populate("organizer", "name email role")
      .populate("participant", "name email role")
      .sort({ startTime: 1 });

    res.status(200).json({ meetings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ACCEPT or REJECT a meeting
const updateMeetingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'

    if (!["accepted", "rejected", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    // Only participant or organizer can update
    if (
      meeting.participant.toString() !== req.user.id &&
      meeting.organizer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    meeting.status = status;
    await meeting.save();

    res.status(200).json({ message: `Meeting ${status}`, meeting });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { scheduleMeeting, getMyMeetings, updateMeetingStatus };
