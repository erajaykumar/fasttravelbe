import express, { Express, Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLString, buildSchema } from 'graphql';
import { GraphQLObjectType } from 'graphql';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import { createBookingResponse, mockBooking, registerUserResponse } from './_data/mockResponses';

//load environment variables
dotenv.config({
  path: 'config/.env.development',
});

//Initialize microservice port 
const PORT = process.env.PORT;

//Mongo DB setup starts

const MONGODBURI:string = process.env.MONGO_URI ?? "URI NOT Found!"

mongoose.connect(MONGODBURI).catch((err)=>{
  console.error(err);
  console.error(`Error occured while connecting to DB ${err.message}`);
});

mongoose.connection.once('open', ()=>{
  console.log(`Connected to database`);
})

//Mongo DB setup ends

const app: Express = express();
app.use(cors());

//Body parser
app.use(express.json());

const schema = buildSchema(`

  enum bookingStatusEnum {
    IN_PROGRESS,
    COMPLETED
  }
  enum vehicleStatusEnum {
    AVAILABLE
    NOT_AVAILABLE
  }
  enum userTypeEnum {
    RIDER
    PARTNER
    ADMIN
  }
  enum genderEnum {
    M
    F
    O
  }
  input TodoInput {
    text: String,
    completed: Boolean,
  }
  type Todo {
    id: ID!
    text: String
    completed: Boolean
  }
  input BookingDataInputType {
    origin: String,
    destination: String,
    fare: Int,
    riderId: String,
  }
  type BookingDataType {
    bookingId: ID,
    origin: String,
    destination: String,
    fare: Int,
    riderId: String,
    partnerId: String,
    vehicleId: String,
    status: bookingStatusEnum,
    createdAt: String,
    completedAt: String,
    scheduledCompletionTime: String
  }
  type AddressType {
    addressLine: String,
    addressLine2: String,
    city: String,
    state: String,
    country: String,
    pincode: String
  }
  input AddressInputType {
    addressLine: String,
    addressLine2: String,
    city: String,
    state: String,
    country: String,
    pincode: String
  }
  input UserDataInputType {
    password:String,
    firstName: String,
    lastName: String,
    gender: genderEnum,
    emailAddress: String,
    userType: userTypeEnum,
    dob: String,
    state:String,
    city:String,
    district:String,
    pinCode:String,
    address: AddressInputType,
    mobileNumber: String,
    drivingLicenseNumber: String,
    vehicleRegistrationNumber: String,
  }
  type UserDataType {
    userId: String,
    jwt: String,
    firstName: String,
    lastName: String,
    gender: genderEnum,
    emailAddress: String,
    userType: userTypeEnum,
    dob: String,
    address: AddressType,
    mobileNumber: String,
    drivingLicenseNumber: String,
    vehicleRegistrationNumber: String,
    createdAt: String,
  }
  input UserSignInInputType {
    emailAddress: String,
    password: String
  }
  type Query {
    getTodo(id: ID!): Todo,
    getBookings(userId: ID!): [BookingDataType],
    getBookingById(bookingId: ID!): BookingDataType
  }
  type Mutation {
    createTodo(input: TodoInput): Todo
    updateTodo(id: ID!, input: TodoInput): Todo
    createBooking(bookingData: BookingDataInputType): BookingDataType,
    registerUser(userData: UserDataInputType): UserDataType,
    signInUser(userData: UserSignInInputType): UserDataType,
  }
`);

type ToDoType = {id: string, text: string, completed: boolean};
type TodoListType = [ToDoType?]; 

const todos: TodoListType = [];

class Todo {
  id: string
  text: string
  completed: boolean
  constructor(id: string, text: string) {
    this.id = id;
    this.text = text;
    this.completed = false;
  }
}

let baseId = 100000;

const root = {
  getTodo: (data: any) => {
    const matchingTodo = todos.find(item => item?.id === data?.id);
    if (!matchingTodo) {
      throw new Error('Todo not found.');
    }
    return matchingTodo;
  },
  createTodo: (data: any) => {
    const {text} = data?.input;
    const id = ++baseId;
    const todo = new Todo(id.toString(), text);
    todos.push(todo);
    return todo;
  },
  updateTodo: (data: any) => {
    const id = data.id;
    const { text, completed } = data?.input;
    const matchingTodo = todos.find(item => item?.id === id);
    if (!matchingTodo) {
      throw new Error('Todo not found.');
    }
    matchingTodo.text = text || matchingTodo.text;
    matchingTodo.completed = completed || matchingTodo.completed;
    return matchingTodo;
  },
  getBookings({userId}: any) {
    console.log(userId);
    return [createBookingResponse, mockBooking];
  },
  getBookingById({bookingId}: any) {
    console.log(bookingId);
    return createBookingResponse;
  },
  createBooking({ bookingData }: any) {
    console.log(bookingData);
    return createBookingResponse;
  },
  
  registerUser({ userData }: any) {
    console.log(userData);
    return registerUserResponse;
  },
  signInUser({ userData }: any) {
    console.log(userData);
    return registerUserResponse;
  },
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}))


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
