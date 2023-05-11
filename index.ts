import express, { Express, Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLString, buildSchema } from 'graphql';
import { GraphQLObjectType } from 'graphql';
import dotenv from 'dotenv';
import cors from 'cors';

import { GraphQLScalarType } from 'graphql';

export const createBookingResponse = {
  "bookingId":"bid_100001",
  "origin":"Rajiv chowk, gurgaon",
  "destination":"Railway station, Anand Vihar, New Delhi",
  "fare": 550,
  "riderId":"ruid_000001",
  "partnerId":"puid_000001",
  "vehicleId":"vid_000001",
  "status":"IN_PROGRESS",
  "createdAt": new Date().toDateString(),
  "completedAt": new Date(+new Date() + 55 * 60 * 1000).toDateString(),
  "scheduledCompletionTime": new Date(+new Date() + 54 * 60 * 1000).toDateString()
}

export const mockBooking = {
  "bookingId":"bid_100002",
  "origin":"MG Road, gurgaon",
  "destination":"Railway station, Old delhi",
  "fare": 750,
  "riderId":"ruid_000001",
  "partnerId":"puid_000001",
  "vehicleId":"vid_000001",
  "status":"COMPLETED",
  "createdAt": new Date(+new Date() - 20 * 60 * 60 * 1000).toDateString(),
  "completedAt": new Date(+new Date() - 18.5 * 60 * 60 * 1000).toDateString(),
  "scheduledCompletionTime": new Date(+new Date() -18.5 * 60 * 60 * 1000).toDateString()
}

// export const getBookingsResponse = [createBookingResponse, mockBooking];

export const registerUserResponse = {
  "userId":"puid_000001",
  // "password":"test@1234",
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJ1c2VySWQiOiJydWlkXzAwMDAwMSIsInBhc3N3b3JkIjoidGVzdEAxMjM0In0.Zx5OlAmrAK9hlf3yXxmG6klxlruGDJy55tkFhVL9ZSI",
  "firstName":"Test",
  "lastName":"User 1",
  "gender":"M",
  "emailAddress":"test1@tester.com",
  "userType":"PARTNER",
  "dob": new Date(+new Date() - 30 * 365 * 24 * 60 * 60 * 1000).toDateString(),
  "address":
    {"addressLine":"line 1","addressLine2":"line2","city":"text city","state":"test state","country":"test country","pincode":"100001"},
  "mobileNumber":"8765432109",
  "drivingLicenseNumber":"DL_NO_TEST_1234",
  "vehicleRegistrationNumber":"VEH_NO_TEST_DL_34 1234",
  "createdAt": new Date(+new Date() -  50 * 24 * 60 * 60 * 1000).toDateString(),
};

// export const signInResponse = {
//   "userId":"puid_000001",
//   // "password":"test@1234",
//   "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJ1c2VySWQiOiJydWlkXzAwMDAwMSIsInBhc3N3b3JkIjoidGVzdEAxMjM0In0.Zx5OlAmrAK9hlf3yXxmG6klxlruGDJy55tkFhVL9ZSI",
//   "firstName":"Test",
//   "lastName":"User 1",
//   "gender":"M",
//   "emailAddress":"test1@tester.com",
//   "userType":"PARTNER",
//   "dob":new Date(+new Date() - 30 * 365 * 24 * 60 * 60 * 1000),
//   "address":
//     {"addressLine":"line 1","addressLine2":"line2","city":"text city","state":"test state","country":"test country","pincode":"100001"},
//   "mobileNumber":"8765432109",
//   "drivingLicenseNumber":"DL_NO_TEST_1234",
//   "vehicleRegistrationNumber":"VEH_NO_TEST_DL_34 1234"  
// };

//load environment variables
dotenv.config({
  path: './config/config.env',
});

//Initialize microservice port 
const PORT = process.env.PORT;

const app: Express = express();
app.use(cors());


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
