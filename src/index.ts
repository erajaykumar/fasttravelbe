import express, { Express, Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLString, buildSchema, graphql, GraphQLSchema, GraphQLInt, GraphQLList, GraphQLID, GraphQLObjectType  } from 'graphql';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

import Booking from './models/booking';
// import {
//   createBookingResponse,
//   mockBooking,
//   registerUserResponse,
// } from './_data/mockResponses';
import { bookingStatusEnum, userTypeEnum, genderEnum, vehicleStatusEnum } from './common/enums';
import { UserModel } from './models/user';
import { getNewId } from './common/utils';
import { authorize, createAccessToken, encryptPassword } from './common/auth';
import { IncomingMessage } from 'http';

//load environment variables
dotenv.config({
  path: 'config/.env.development',
});

//Initialize microservice port
const PORT = process.env.PORT;

//Mongo DB setup starts

const MONGODBURI: string = process.env.MONGO_URI ?? 'URI NOT Found!';

mongoose.connect(MONGODBURI).catch((err) => {
  console.error(err);
  console.error(`Error occured while connecting to DB ${err.message}`);
});

mongoose.connection.once('open', () => {
  console.log(`Connected to database`);
});

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
    password: String,
    userType: userTypeEnum,
  }
  type Query {
    getTodo(id: ID!): Todo,
    getBookings(userId: ID!, userType: userTypeEnum): [BookingDataType],
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

type ToDoType = { id: string; text: string; completed: boolean };
type TodoListType = [ToDoType?];

const todos: TodoListType = [];

class Todo {
  id: string;
  text: string;
  completed: boolean;
  constructor(id: string, text: string) {
    this.id = id;
    this.text = text;
    this.completed = false;
  }
}

let baseId = 100000;

const root = {
  async getBookings({ userId, userType }: any, message: IncomingMessage) {
    console.log(userId);
    authorize(message.headers);

    const filter: any = {};
    if (userType === userTypeEnum.RIDER) {
      filter.riderId = userId;
    } else if (userType === userTypeEnum.PARTNER) {
      filter.partnerId = userId;
    }
    const bookings = await Booking.find(filter);
    return bookings;
  },

  async getBookingById({ bookingId }: any, message: IncomingMessage) {
    console.log('Search string : ' + bookingId);
    authorize(message.headers);
  
    const booking = await Booking.findOne({ bookingId });
    console.log('Booking data:', booking);
    return booking;
  },
  
  // explore params
  async createBooking({ bookingData }: any, message: IncomingMessage) {
    authorize(message.headers);

    const bookingId = getNewId('bid');
    bookingData.bookingId = bookingId;
    bookingData.partnerId = 'pid_000001';
    bookingData.vehicleId = 'vid_000001';
    bookingData.status = bookingStatusEnum.IN_PROGRESS;

    try {
      const booking = await Booking.create(bookingData);
      console.log('Saved succesffully!', booking);
      return booking;  
    } catch(err) {
      throw new Error('Server issue, could not create a booking! Please try again.');
    }
  },

  async registerUser({ userData }: any) {
    console.log(userData);
    const { userType, password, emailAddress } = userData;
    if (!userType || !password || !emailAddress) {
      throw new Error('Mandatory fields missing..');
    }
    let userIdPrefix = 'aid';
    if (userType === userTypeEnum.RIDER) {
      userIdPrefix = 'rid';
    } else if (userType === userTypeEnum.PARTNER) {
      userIdPrefix = 'pid';
    };
    // create user id
    const userId = getNewId(userIdPrefix)
    userData.userId = userId;
    
    // encrypt password
    const hash = encryptPassword(password)
    userData.password = hash;
    
    try {
      const user = await UserModel.create(userData);
      delete user.password;
      // tbd password should not be part of response
      return user;
    } catch(err) {
      throw new Error('Unable to register user Please try again..');
    }
  },
  
  async signInUser({ userData }: any) {
    console.log(userData);
    const { userType, emailAddress, password } = userData;
    if (!userType || !password || !emailAddress) {
      throw new Error('Mandatory fields missing..');
    }
    try {
      const user: any = await UserModel.findOne({ userType, emailAddress });
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      
      // generate token
      if (!isPasswordCorrect) {
        throw new Error();
      }
      const token = createAccessToken(emailAddress, userType);
      user.jwt = token;
      delete user.password;
      return user;
    } catch(err) {
      throw new Error('Wrong password. Please use correct password.');
    }
  },
};

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

//Temporarily catch all the get request and serve static content
app.get('/', (req: Request, res: Response) => {
  res.send(
    '<h1><center>Welcome to Fast Travel APIs (Express + TypeScript)..</center></h1>'
  );
});

//Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});
