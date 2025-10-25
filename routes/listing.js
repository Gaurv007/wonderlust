const express = require("express");
const router = express.Router();
const wrapasycn = require("../utils/wrapasycn");
const Listing = require("../models/listing");
const {isLoggedIn , isOwner ,validateListing} = require("../middleware.js")
const listingController = require("../controlers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})

router
.route("/")
.get( wrapasycn(listingController.index))
.post( isLoggedIn,upload.single('listing[image]'),validateListing, wrapasycn(listingController.createListing)
);


// NEW - form to create listing
router.get("/new", isLoggedIn, listingController.renderNewForm);


router
.route("/:id")
.get(wrapasycn(listingController.showListing))
.put(isLoggedIn,isOwner, isOwner,upload.single('listing[image]'),validateListing, wrapasycn(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapasycn(listingController.deleteListing));

router.get("/:id/edit",isLoggedIn,isOwner, wrapasycn(listingController.renderEditForm));


module.exports = router;
