import mongoose from "mongoose";

const clubGallerySchema = new mongoose.Schema({
    images: { type: [String], required: true },
    title: { type: String, required: true },
}, {
    timestamps: true
})

const ClubGallery = mongoose.model("ClubGallery", clubGallerySchema);
export default ClubGallery;