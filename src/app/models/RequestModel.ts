/* eslint-disable @typescript-eslint/camelcase */
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const RequestSchema = new Schema({
  Type: { type: Number, ref: 'RequestType', required: true },
  SuccessMessageModel: Schema.Types.ObjectId,
  ErrorMessageModel: Schema.Types.ObjectId,
  TokenFieldName: String,
  Endpoint: { type: String, required: true },
  Method: { type: String, required: true },
  Body: Object,
  Query: Object,
  Headers: Object,
  Form: Object
})

export default RequestSchema
