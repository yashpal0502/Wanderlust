const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync.js");
const listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })

router
  .route("/")
  .get(wrapAsync(listingController.index)) // index route
  .post(
    // create route
    isLoggedIn,
    validateListing,
    upload.single('listing[image]'),
    wrapAsync(listingController.createListing)
  );

router.route("/new").get(isLoggedIn, listingController.newListing);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) // show route
  .put(
    // update route
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    // delete route
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
  );

// index route
// router.get("/", wrapAsync(listingController.index));

// new listing route

// router.get("/new", isLoggedIn, listingController.newListing);

// show route

// router.get("/:id", wrapAsync(listingController.showListing));

// create route
// router.post(
//   "/",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingController.createListing)
// );

// edit listing route

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

//update route

// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(listingController.updateListing)
// );

// delete route

// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.deleteListing)
// );

module.exports = router;
