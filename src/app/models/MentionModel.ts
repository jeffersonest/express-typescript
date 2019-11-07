/* eslint-disable @typescript-eslint/camelcase */
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const TwitterMentionsSchema = new Schema({
  message_id: { type: String, required: true },
  text: { type: String, required: true },
  author_id: { type: String, required: true },
  possibly_sensitive: { type: String, required: true },
  lang: { type: String, required: true },
  stats: { type: Object },
  created_at: { type: Date, required: true }
})

export default mongoose.model('TwitterMentions', TwitterMentionsSchema)
