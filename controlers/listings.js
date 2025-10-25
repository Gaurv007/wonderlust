const Listing = require("../models/listing.js");

// module.exports.index = async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// }


// controllers/listings.js
module.exports.index = async (req, res) => {
  const { search } = req.query;

  let allListings;
  if (search && search.trim() !== "") {
    const regex = new RegExp(search, "i"); // i = case-insensitive
    allListings = await Listing.find({
      $or: [{ title: regex }, { location: regex }, { country: regex }],
    });
  } else {
    allListings = await Listing.find({});
  }

  res.render("listings/index.ejs", { allListings, search });
};


module.exports.renderNewForm = (req, res) => {

  res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" }, // ✅ works only if Review has author ref
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing);
    if (req.file) {
      const { path: url, filename } = req.file;
      newListing.image = { url, filename };
    }

    newListing.owner = req.user._id;
    await newListing.save();

    req.flash("success", "New listing created!");
    res.redirect("/listings");
  } catch (err) {
    console.error("Error creating listing:", err);
    req.flash("error", "Failed to create listing.");
    res.redirect("/listings");
  }
};
// module.exports.renderEditForm = async (req, res) => {
//   const { id } = req.params;
//   const listing = await Listing.findById(id);
//    if (!listing) {
//     req.flash("error","listing you requested does not exist");
//    return  res.redirect("/listings")
//   }
// let originalimage = listing.image.url
// originalimage = originalimage.replace("/upload","/upload/h_300,w_250")
//   res.render("listings/edit.ejs", { listing ,originalimage});
// }

// module.exports.updateListing = async (req, res) => {
//   const { id } = req.params;
//   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  
//   if(typeof req.file != "undefined"){
//       let url = req.file.path;
//   let filename = req.file.filename;
//   listing.image = {url,filename};
// await listing.save();
//   }

//   req.flash("success", "Listing Updated!");
//   res.redirect(`/listings/${id}`);
// }

//delete
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  
  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  // ✅ Only modify image if it exists
  let originalimage = "";
  if (listing.image && listing.image.url) {
    originalimage = listing.image.url.replace("/upload", "/upload/h_300,w_250");
  }

  res.render("listings/edit.ejs", { listing, originalimage });
};


//original
// module.exports.updateListing = async (req, res) => {
//   const { id } = req.params;

//   // update basic fields first
//   const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

//   // ✅ Only update image if a new file is uploaded
//   if (req.file) {
//     listing.image = {
//       url: req.file.path,
//       filename: req.file.filename,
//     };
//   }

//   await listing.save();

//   req.flash("success", "Listing updated successfully!");
//   res.redirect(`/listings/${listing._id}`);
// };

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  // ✅ Fetch the existing listing first
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // ✅ Update the basic fields
  listing.title = req.body.listing.title;
  listing.description = req.body.listing.description;
  listing.price = req.body.listing.price;
  listing.country = req.body.listing.country;
  listing.location = req.body.listing.location;

  // ✅ Only update image if a new one was uploaded
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","Listing deleted")
  res.redirect("/listings");
}

