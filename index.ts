import express, { Express, Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLString, buildSchema } from 'graphql';
import { GraphQLObjectType } from 'graphql';
import dotenv from 'dotenv';
import { createBookingResponse, mockBooking, registerUserResponse } from './mockResponses';
//load environment variables
dotenv.config({
  path: './config/config.env',
});

//Initialize microservice port 
const PORT = process.env.PORT;

const app: Express = express();

//Body parser
app.use(express.json());

// type DateScalar = new GraphQLScalarType({
//   name: 'Date',
//   parseValue(value: any) {
//     return new Date(value);
//   },
//   serialize(value: any) {
//     return value.toISOString();
//   },
// })

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
    firstName: String,
    lastName: String,
    gender: genderEnum,
    emailAddress: String,
    userType: userTypeEnum,
    dob: String,
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

// let todos: ToDoType  = {id: '', text: ''};
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

// const server = new ApolloServer({
//   typeDefs,
//   resolvers: {
//     Date: DateScalar,
//     // Remaining resolvers..
//   },
// });



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




// // // Construct a schema, using GraphQL schema language
// var schema = buildSchema(`
//   type Query {
//     hello: String,
//     bye(input: MessageInput): [Message]
//   },
//   input MessageInput {
//     content: String
//     author: String,
//   }
//   type Message {
//     content: String
//     author: String
//   }
// `)

// // type Mutation {
// //   createBooking: CreateBookingType
// // }


// // The root provides a resolver function for each API endpoint
// var root = {
//   hello: () => {
//     return "Hello world!"
//   },
//   bye: (input: {content: String, author: String}) => {
//     const { content, author } = input;
//     console.log(content, author);
//     const returnValue = [];
//     for(let i=0; i<3; i++) {
//       returnValue.push({ content, author })
//     }
//     return returnValue;
//   },
//   // createBooking: () => {
//   //   return createBookingMock
//   // }
// }
