import { Schema, model } from "mongoose";
import { genderEnum, userTypeEnum } from "../common/enums";

// TBD - make fields mandatory
const UserSchema = new Schema({
    userId: String,
    jwt: String,
    firstName: String,
    lastName: String,
    gender: { type: String, enum: genderEnum },
    emailAddress: String,
    password: String,
    userType: { type: String, enum: userTypeEnum },
    dob: String,
    address: {
        addressLine: String,
        addressLine2: String,
        city: String,
        state: String,
        country: String,
        pincode: String
    },
    mobileNumber: String,
    drivingLicenseNumber: String,
    vehicleRegistrationNumber: String,
    createdAt: { type: Date, default: new Date() },
});

export const UserModel = model('user', UserSchema);