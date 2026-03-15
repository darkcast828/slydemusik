import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  stageName: String,
  country: String,
  createdAt: { type: Date, default: Date.now }
});

export const Artist = mongoose.models.Artist || mongoose.model("Artist", ArtistSchema);
