import dotenv from 'dotenv';
dotenv.config();
import app from './Controllers/index.js';
import packageRoutes from './Routes/packageRoutes.js';
import extraRoutes from './Routes/extraRoutes.js';
import cors from 'cors';
import staticsMw from './Models/Middlewares/statics.js';

staticsMw(app);

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use("/api", extraRoutes);
app.use("/api", packageRoutes);

app.listen(3000, () => {
  console.log(`App is listening on port 3000`);
});