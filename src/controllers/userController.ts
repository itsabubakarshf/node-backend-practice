import { Request, Response } from 'express';
import userModel from '../model/userModel';
import { customLog } from "../utility/common"


export const getUserController = async (req: Request, res: Response) => {
    try {
        customLog("Fetching all users");
        const users = await userModel.find({});

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        res.status(200).json({
            message: "users retrieved successfully",
            data: users
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Error occurred while retrieving users",
            error: error.message
        });
    }
};
