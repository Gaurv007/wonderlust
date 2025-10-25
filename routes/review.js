
const express = require("express");
const router = express.Router({ mergeParams: true }); // ✅ FIXED HERE
const wrapasycn = require("../utils/wrapasycn.js");
const expresserror = require("../utils/expresserror.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validatereview, isLoggedIn , isreviewAuthor} = require("../middleware.js")
const reviewController = require("../controlers/reviews.js");

// POST route for creating a new review
router.post("/", isLoggedIn, validatereview, wrapasycn(reviewController.createreview));

// DELETE route for deleting a review
router.delete("/:reviewid", isLoggedIn,isreviewAuthor, wrapasycn(reviewController.destroyreview));

module.exports = router;
