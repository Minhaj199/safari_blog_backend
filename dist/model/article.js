import mongoose, { Schema } from "mongoose";
const schema = new Schema({
    title: { type: String, unique: true },
    description: String,
    categories: [String],
    content: String,
    author: {
        id: { type: mongoose.Schema.ObjectId, ref: "users" },
        name: String,
        avatar: {
            type: String,
            default: "   data:image/png;base64,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",
        },
    },
    dislikes: [{ type: mongoose.Schema.ObjectId, ref: "users" }],
    image: {
        type: String,
        default: "https://media.istockphoto.com/id/1458215547/photo/brown-bear.jpg?s=612x612&w=0&k=20&c=MRQhtNC_-P0llLRwwA3wmbQL6iroSjUla1PmvvEWCZU=",
    },
    publishedAt: { type: Date, default: new Date() },
    likes: [{ type: mongoose.Schema.ObjectId, ref: "users" }],
    blocks: [{ type: mongoose.Schema.ObjectId, ref: "users" }],
});
export const articleModel = mongoose.model("articles", schema);
