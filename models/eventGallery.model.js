import mongoose from 'mongoose';

const eventGallerySchema = new mongoose.Schema({
    banner: { type: String, required: true },
    title: { type: String, required: true },
    images: { type: [String], required: true },
    content: { type: String, required: true },
    slug: { type: String },
}, {
    timestamps: true
});

eventGallerySchema.pre('save', function (next) {
    if (!this.slug) {
        // Create slug from title and id, max 10 characters
        const base = `${this.title.replace(/\s+/g, '').toLowerCase()}${this._id ? this._id.toString() : ''}`;
        this.slug = base.substring(0, 10);
    }
    next();
});

const EventGallery = mongoose.model('EventGallery', eventGallerySchema);
export default EventGallery;