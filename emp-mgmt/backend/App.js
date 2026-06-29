import 'dotenv/config';
import express from "express";
import cors from "cors";

import employeeRouter from './router/employee_router.js';

const App = express();

const PORT = process.env.PORT || 3001;

App.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));

App.use(express.json());

App.use('/employee', employeeRouter);

App.listen(PORT, () => {
  console.log(`server invoked at http://localhost:${PORT}`);
});

export default App;
