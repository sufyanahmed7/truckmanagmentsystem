import { gql } from "graphql-tag";

export const itemTypeDefs = gql`
  type Item {
    _id: ID!
    name: String!
    code: String!
    available: String!
    weight: String!
    createdAt: String
    updatedAt: String
  }

  input ItemInput {
    name: String!
    code: String!
    available: String!
    weight: String!
  }

  type Query {
    items(q: String): [Item!]!
    item(id: ID!): Item
  }

  type Mutation {
    createItemMutation(input: ItemInput!): Item!
    updateItemMutation(id: ID!, input: ItemInput!): Item!
    deleteItemMutation(id: ID!): Boolean!
  }

  type Subscription {
    itemAddedSubscription: Item!
    itemUpdatedSubscription: Item!
    itemDeletedSubscription: ID!
  }
`;
