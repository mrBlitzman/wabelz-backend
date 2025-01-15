import dotenv from "dotenv";
dotenv.config();
import app from "./Controllers/index.js";
import infoRoutes from "./Routes/infoRoutes.js";
import validationRoutes from "./Routes/validationRoutes.js";
import verificationRoutes from "./Routes/verificationRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js";
import cors from "cors";
import staticsMw from "./Models/Middlewares/statics.js";
import proceedOrder from "./Controllers/proceedOrder.js";

staticsMw(app);

app.use(
  cors({
    origin: [
      "https://www.wabelz.com",
      "http://localhost:5173",
      "http://192.168.1.103:5173",
    ],
  })
);

app.use("/api", validationRoutes);
app.use("/api", verificationRoutes);
app.use("/api", infoRoutes);
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.post("/api/proceedOrder", proceedOrder);

app.listen(3000, () => {
  console.log(`App is listening on port 3000`);
});
