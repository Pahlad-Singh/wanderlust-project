const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.Index = async (req, res, next) => {
  const AllListings = await Listing.find({});
  let listLength = AllListings.length;
  res.render("listings/index.ejs", { AllListings, listLength });
};

module.exports.renderNewForm = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createNewForm = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.geometry = response.body.features[0].geometry;

  let saveListing = await newListing.save();
  console.log(saveListing);
  req.flash("success", "New Listing Created!");
  res.redirect("/");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.renderEditListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let originalImageUrl = listing.image.url;
  originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleteList = await Listing.findByIdAndDelete(id);
  console.log(deleteList);
  req.flash("success", "Listing Deleted!");
  res.redirect("/");
};
