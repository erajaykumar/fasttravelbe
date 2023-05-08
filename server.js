const express = require('express');
const dotenv = require('dotenv');

//load environment variables
dotenv.config({
  path: './config/config.env',
});

//Initialize microservice port 
const PORT = process.env.PORT;

const app = express();

//Body parser
app.use(express.json());

//Temporarily catch all the get request and serve static content
app.get('/', (req, res) => {
  res.send('<h1><center>Welcome to Fast Travel APIs</center></h1>');
});

//Start server
app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  )
);


//Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server & exit process
  server.close(() => process.exit(1));
});
