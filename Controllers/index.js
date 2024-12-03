import express from 'express';
const app = express();
import dbConnection from '../Models/Services/db.js';

app.use(express.json());
dbConnection();
export default app;
