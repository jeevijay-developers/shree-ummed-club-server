import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  image: { type: String, required: true },
  eventDate: { type: Date, required: true },
  shortDescription: { type: String, required: true },
  slug: { type: String },
}, {
  timestamps: true
});

eventSchema.pre("save", function (next) {
  if (!this.slug) {
    // Create slug from shortDescription and id, max 10 characters
    const base = `${this.shortDescription.replace(/\s+/g, "").toLowerCase()}${this._id ? this._id.toString() : ""}`;
    this.slug = base.substring(0, 10);
  }
  next();
});

const Event = mongoose.model("Event", eventSchema);

export default Event;