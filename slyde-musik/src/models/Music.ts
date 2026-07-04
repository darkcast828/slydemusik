import mongoose from "mongoose";

const MusicSchema = new mongoose.Schema({
  title: String,
  artist: String,
  genre: String,
  audio: String,
  cover: String,
  releaseDate: { type: Date, default: Date.now },
  streams: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 }
});

export const Music = mongoose.models.Music || mongoose.model("Music", MusicSchema);
