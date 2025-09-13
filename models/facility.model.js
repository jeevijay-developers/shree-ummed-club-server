import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: { type: [String], required: true },
  data: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  slug: { type: String },
});

facilitySchema.pre("save", function (next) {
  if (!this.slug) {
    // Use name and _id, remove spaces, lowercase, join, and trim to 10 chars
    const base = `${this.name.replace(/\s+/g, "").toLowerCase()}${this._id ? this._id.toString() : ""}`;
    this.slug = base.substring(0, 10);
  }
  next();
});

const Facility = mongoose.model("Facility", facilitySchema);

export default Facility;
