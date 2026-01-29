import express from "express";
import userRoutes from "./routes/user.routes.ts";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
