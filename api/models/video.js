const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const thumbnailsizeSchema = new Schema({
    url:String,
    width:String,
    height:String,
})

const thumbnailSchema = new Schema({
    default:thumbnailsizeSchema,
    medium:thumbnailsizeSchema,
    high:thumbnailsizeSchema,
    standard:thumbnailsizeSchema,
    maxers:thumbnailsizeSchema,
})

const snippetSchema = new Schema({
    title:String,
    description:String,
    thumbnails:thumbnailSchema,
    channelTitle:String,
    
})

const statisticSchema = new Schema({
    viewCount:String,
    likeCount:String,
    dislikeCount:String,
    commentCount:String,
})

const videoSchema = new Schema({
    kind:String,
    etag:String,
    id:String,
    snippet:snippetSchema,
    statistics:statisticSchema,
    
})

module.exports = mongoose.model('Videos',videoSchema,'Videos');