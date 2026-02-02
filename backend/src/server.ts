import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
//Routes
import userRoutes from "./routes/auth.routes.ts";
import productRoutes from "./routes/product.routes.ts";
import CartRoutes from "./routes/cart.routes.ts";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", CartRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
