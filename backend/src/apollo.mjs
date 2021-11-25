import { ApolloServer, gql, UserInputError } from 'apollo-server';
import { v4 as uuid } from 'uuid';
let persons = [
    {
        name: 'Arto Hellas',
        phone: '040-123543',
        street: 'Tapiolankatu 5 A',
        city: 'Espoo',
        id: '3d594650-3436-11e9-bc57-8b80ba54c431'
    },
    {
        name: 'Matti Luukkainen',
        phone: '040-432342',
        street: 'Malminkaari 10 A',
        city: 'Helsinki',
        id: '3d599470-3436-11e9-bc57-8b80ba54c431'
    },
    {
        name: 'Venla Ruuska',
        street: 'Nallemäentie 22 C',
        city: 'Helsinki',
        id: '3d599471-3436-11e9-bc57-8b80ba54c431'
    },
];
const typeDefs = gql`
type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editNumber(
        name: String!
        phone: String!
      ): Person
  }
  enum YesNo {
    YES
    NO
  }

type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
  }
`;
const resolvers = {
    Query: {
        personCount: (root) => {
            console.log(root);
            return persons.length;
        },
        allPersons: (root, args) => {
            console.log('root',
                root
            );
            console.log('ARGS',
                args
            );
            if (!args.phone) {
                return persons;
            }
            const byPhone = (person) =>
                args.phone === 'YES' ? person.phone : !person.phone;
            return persons.filter(byPhone);
        },
        findPerson: (root, args) => {
            console.log('root',
                root
            );
            console.log(
                args
            );
            return persons.find(p => p.name === args.name);

        }
    },
    Person: {
        name: (root) => root.name,
        phone: (root) => root.phone,
        address: (root) => {
            console.log('city', root);
            return {
                city: root.city,
                street: root.street
            };
        },
        id: (root) => root.id
    },
    Mutation: {
        addPerson: (root, args) => {
            const person = { ...args, id: uuid() };
            persons = persons.concat(person);
            return person;
        },
        editNumber: (root, args) => {
            const person = persons.find(p => p.name === args.name);
            if (!person) {
                return null;
            }

            const updatedPerson = { ...person, phone: args.phone };
            persons = persons.map(p => p.name === args.name ? updatedPerson : p);
            return updatedPerson;
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
