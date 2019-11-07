/* eslint-disable @typescript-eslint/camelcase */
import mongoose from 'mongoose'
import RequestModel from './RequestModel'
const Schema = mongoose.Schema

const ChannelSchema = new Schema({
  CreatedBy: String,
  TimeCreated: Date,
  ModifiedBy: String,
  TimeModified: Date,
  ObjectModelName: { type: String, required: true, index: true },
  Name: { type: String, required: true },
  ContactAttributeNames: [String],
  FormatQueue: String,
  SendQueue: { type: String, required: true },
  Request: RequestModel,
  RequestAuth: RequestModel,
  Config: {}
})

export default mongoose.model('Channel', ChannelSchema)
