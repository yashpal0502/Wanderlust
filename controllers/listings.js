const listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.newListing = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const Listing = await listing
    .findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!Listing) {
    req.flash("error", "Listing does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { Listing });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const Listing = await listing.findById(id);

  if (!Listing) {
    req.flash("error", "Listing does not exist!");
    res.redirect("/listings");
  }

  let originalImgUrl = Listing.image.url;
  originalImgUrl = originalImgUrl.replace("/upload", "/upload/w_250");

  res.render("listings/edit.ejs", { Listing, originalImgUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let list = await listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;

    list.image = { url, filename };
    await list.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedList = await listing.findByIdAndDelete(id);
  console.log(deletedList);

  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
