import express from 'express';
const app = express();
import dbConnection from '../Models/Services/db.js';

dbConnection();
export default app;
