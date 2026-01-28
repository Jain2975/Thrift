import { Request,Response } from "express";
import { createUser,updateUser,deleteUser } from "../services/useServices.js";

export const registerUser= async(req: Request,res:Response)=>{
    try{
        const {email,name}=req.body;
        const user =  await createUser(email,name);

        res.status(201).json(user);

    }catch(err){
        res.status(400).json({error: "Error creating user"});
    }
};

export const editUser = async (req: Request<{id:string}>,res:Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = await updateUser(id, updates);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Error updating user" });
  }
};

export const removeUser = async (req: Request<{email: string}>,res:Response) => {
  try {
    const { email } = req.params;
    await deleteUser(email);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ error: "Error deleting user" });
  }
};