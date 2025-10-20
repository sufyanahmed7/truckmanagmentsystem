import gql from "graphql-tag";

export const contactTypeDefs = gql`
  scalar JSON

  enum ContactType {
    supplier
    customer
  }

  type Contact {
    _id: ID!
    account: String!
    company: String!
    email: String!
    phone: String
    firstName: String
    lastName: String
    type: ContactType!
  }

  input ContactInput {
    account: String!
    company: String!
    email: String!
    phone: String
    firstName: String
    lastName: String
    type: ContactType!
  }

  input UpdateContactInput {
    account: String
    company: String
    email: String
    phone: String
    firstName: String
    lastName: String
    type: ContactType
  }

  type Query {
    contacts(q: String): [Contact!]!
    contact(id: ID!): Contact
    me: JSON
  }

  type Mutation {
    createContactMutation(input: ContactInput!): Contact!
    updateContactMutation(id: ID!, input: UpdateContactInput!): Contact!
    deleteContactMutation(id: ID!): String!
  }

  type Subscription {
    contactAddedSubscription: Contact
    contactUpdatedSubscription: Contact
    contactDeletedSubscription: String!
  }
`;
