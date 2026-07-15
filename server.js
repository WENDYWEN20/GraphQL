import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
const users = [
  { id: 1, name: "John Doe", age: 30, isMarried: true },
  { id: 1, name: "Jane Smith", age: 31, isMarried: true },
  { id: 1, name: "Alice Jason", age: 32, isMarried: false },
];
const typeDefs = `type Query {
getUsers:[User]
getUserById(id: ID!): User }

type Mutation {
createUser(name:String!, age: Int!, isMarried: Boolean!): User}

type User{
id: ID
name: String
age: Int
isMarried: Boolean
}
`;
const resolvers = {
  Query: {
    getUsers: () => {
      return users;
    },
    getUserById: (parent, args) => {
      const id = args.id;
      return users.find((user) => {
        user.id === id ? user : `User does not exist`;
      });
    },
  },

  Mutation: {
    createUser: (parent, args)=>{
        const {name, age, isMarried}=args
        const newUser={id: ((users.length)+1).toString, name, age, isMarried}
        users.push(newUser)
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});
console.log(`server running on ${url}`);
//Query, Mutation
//typeDefs, resolvers
