const express = require("express");
const router = express.Router();

const {
    addEvent,
    getEvent,
    updateEvent,
    deleteEvent,
    getEvents,
    getEventsByUser,
    getEventsByLocation,
    getEventsByDate,
    joinEvent,
    getMembers

}= require("../controllers/eventController");
const {isAuthenticated, authorize} = require('../middlewares/auth')

router.route("/").post(isAuthenticated,addEvent);
router.route("/:id").get(isAuthenticated,getEvent);
router.route("/update/:id").put(isAuthenticated,updateEvent);
router.route("/delete/:id").delete(isAuthenticated,deleteEvent);
router.route("/getevents").get(isAuthenticated,getEvents);
router.route("/geteventsbyuser").get(isAuthenticated,getEventsByUser);
router.route("/geteventsbylocation").get(isAuthenticated,getEventsByLocation);
router.route("/geteventsbydate").get(isAuthenticated,getEventsByDate);
router.route("/:id/joinevent").post(isAuthenticated,joinEvent);
router.route("/:id/getmembers").get(isAuthenticated,getMembers);

module.exports = router;