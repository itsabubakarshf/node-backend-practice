import {Request,Response} from 'express';
import Pizza from '../model/pizzaModel';
import zod from "zod";
import {customLog} from "../utility/common"

const pizzaSchema = zod.object({
  name: zod.string().min(12).max(30),
  description: zod.string().min(20).max(100),
  price: zod.number().min(15).max(40),
  size: zod.enum(['small', 'medium', 'large']),
  image: zod.string().url().optional()
});

export const createPizzaController=async(req:Request,res:Response)=>{
    try {
        customLog("Validating Schema in pizzaController");
        const pizza=pizzaSchema.safeParse(req.body);
        if(!pizza.success){
            res.status(400).json({
                message:"Invalid data",
                data:pizza.error
            })
        }else{
            customLog("Creating pizza in pizzaController");
            const newPizza=new Pizza(pizza.data);
            newPizza.save();
            customLog("Saving pizza in pizzaController");
            res.status(201).json({
                message:"Pizza created successfully",
                data:newPizza
            })
        }
       
        
    } catch (error) {
        res.status(500).json({
            message:"Something went wrong",
            data:error
        })
    }

}

export const getAllPizzaController = async (req: Request, res: Response) => {
    try {
        customLog("Fetching all pizzas");
        const pizzas = await Pizza.find({});

        if (pizzas.length === 0) {
            return res.status(404).json({ message: "No pizzas found" });
        }

        res.status(200).json({
            message: "Pizzas retrieved successfully",
            data: pizzas
        });
    } catch (error:any) {
        res.status(500).json({
            message: "Error occurred while retrieving pizzas",
            error: error.message
        });
    }
};
