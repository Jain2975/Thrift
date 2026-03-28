import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
//Routes
import authRoutes from "./routes/auth.routes.ts";
import productRoutes from "./routes/product.routes.ts";
import CartRoutes from "./routes/cart.routes.ts";
import userRoutes from "./routes/user.routes.ts";
import orderRoutes from "./routes/order.routes.ts";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", CartRoutes);
app.use("/user", userRoutes);
app.use("/order", orderRoutes);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
