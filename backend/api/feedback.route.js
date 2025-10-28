const express = require("express");
const FeedbackCtrl = require("./feedback.controller");

const router = express.Router();

router.route("/").post(FeedbackCtrl.apiPostFeedback);
router.route("/:id").put(FeedbackCtrl.apiUpdateFeedback);
router.route("/:id").delete(FeedbackCtrl.apiDeleteFeedback);

module.exports = router;
