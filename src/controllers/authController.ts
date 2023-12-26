import { Request, Response } from 'express';
import userModel from '../model/userModel';
import zod from "zod";
import * as jwt from 'jsonwebtoken';
import { customLog } from "../utility/common"


const userSchema = zod.object({
    userName: zod.string()
        .min(12, { message: "Username must be at least 12 characters long" })
        .max(30, { message: "Username must not be more than 30 characters long" }),
    email: zod.string()
        .email({ message: "Invalid email address" }),
    password: zod.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(30, { message: "Password must not be more than 30 characters long" }),
    age: zod.number()
        .min(18, { message: "You must be at least 18 years old" })
        .max(60, { message: "Age must not be more than 60 years old" }),
    About: zod.string().optional()
});
const loginSchema = zod.object({
    email: zod.string()
        .email({ message: "Invalid email address" }),
    password: zod.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(30, { message: "Password must not be more than 30 characters long" }),
})
export const registerController = async (req: Request, res: Response) => {
    try {
        customLog("Validating Schema in userController");
        let user = userSchema.safeParse(req.body);
        if (!user.success) {
            res.status(400).json({
                message: "Invalid data",
                data: user.error.issues
            })
        } else {
            customLog("Creating user in userController");
            user.data.email = user.data.email.toLowerCase();
            const userExists = await userModel.findOne({ email: user.data.email });
            if (userExists) {
                res.status(409).json({
                    message: "User already exists",
                    data: null
                })
            }else{
                const newUser = new userModel(user.data);
            newUser.save();
            customLog("Saving user in userController");
            res.status(201).json({
                message: "user created successfully",
                data: newUser
            })
            }
            
        }


    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error
        })
    }
}

export const loginController = async (req: Request, res: Response) => {
    const loginCredentials = loginSchema.safeParse(req.body);
    if (!loginCredentials.success) {
        res.status(400).json({
            message: "Invalid data",
            data: loginCredentials.error.issues
        })
    } else {
        let { email, password } = loginCredentials.data;
        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(404).json({
                message: "User not found",
                data: null
            })
        } else {
            if (user.password === password) {
                const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY as string, { expiresIn: "1h" });
                res.status(200).json({
                    message: "Login successful",
                    data: {
                        user,
                        token
                    }
                })
            } else {
                res.status(401).json({
                    message: "Invalid password",
                    data: null
                })
            }
        }
    }
}