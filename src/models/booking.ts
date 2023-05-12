import mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import { bookingStatusEnum } from '../common/enums';


const bookingSchema = new Schema({
  bookingId: String,
  origin: String,
  destination: String,
  fare: Number,
  riderId: String,
  partnerId: String,
  vehicleId: String,
  status: {type: String, enum: bookingStatusEnum},
  createdAt: { type: Date, default: ()=> { return Date.now();} },
  completedAt: Date,
  scheduledCompletionTime: { type: Date, default: function(){ return (Date.now()) + 54 * 60 * 1000} },
});

 export default mongoose.model('Booking', bookingSchema);

