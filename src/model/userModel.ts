import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/IUser";
const validateEmail = (email: string) => {
    const regex = /.+\@.+\..+/;
    return regex.test(email);
};
const validateAge = (age: number) => {
    return age >= 18;
}
const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validateEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        validate: [validateAge, "Age must be greater than 18"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    About: {
        type: String,
        required: false
    }

})

const userModel = mongoose.model<IUser>("User", userSchema);

module.exports = userModel;