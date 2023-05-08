import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

//load environment variables
dotenv.config({
  path: './config/config.env',
});

//Initialize microservice port 
const PORT = process.env.PORT;

const app: Express = express();

//Body parser
app.use(express.json());

//Temporarily catch all the get request and serve static content
app.get('/', (req: Request, res:Response) => {
  res.send('<h1><center>Welcome to Fast Travel APIs (Express + TypeScript)..</center></h1>');
});

//Start server
app.listen(
  PORT,
  () => {
    console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
  }
);
