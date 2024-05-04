import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';

import connectDB from './DB/connection.js';
import userRoutes from './src/modules/user/user.routes.js';
import companyRoutes from './src/modules/company/company.routes.js';
import jobRoutes from './src/modules/job/job.routes.js';
import { globalResponse } from './src/middlewares/globalResponse.js';

config({ path: './config/.env' });

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/users', userRoutes);
app.use('/companies', companyRoutes);
app.use('/jobs', jobRoutes);

app.use(globalResponse);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
