import dotenv from 'dotenv';
dotenv.config();
import app from './Controllers/index.js';
import packageRoutes from './Routes/packageRoutes.js';
import extraRoutes from './Routes/extraRoutes.js';
import cors from 'cors';
import staticsMw from './Models/Middlewares/statics.js';
import proceedOrder from './Controllers/proceedOrder.js';

staticsMw(app);

app.use(cors({
  origin: 'https://www.wabelz.com/'
}));

app.use("/api", extraRoutes);
app.use("/api", packageRoutes);
app.post("/api/proceedOrder", proceedOrder);

app.listen(3000, () => {
  console.log(`App is listening on port 3000`);
});