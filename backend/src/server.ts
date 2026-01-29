import express from "express";
import cors from "cors";

//Routes
import userRoutes from "./routes/user.routes.ts";
import { url } from "node:inspector";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
