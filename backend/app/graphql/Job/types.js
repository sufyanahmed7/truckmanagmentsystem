import { gql } from "graphql-tag";

export const jobTypeDefs = gql`
  type JobItem {
    itemId: Item!
    price: Float
    quantity: Int
  }

  type Job {
    _id: ID!
    reference: String!
    supplier: Contact!   
    customer: Contact!  
    date: String!
    items: [JobItem!]!
    userId: String!
    createdAt: String
    updatedAt: String
  }

  input JobItemInput {
    itemId: ID!
    price: Float
    quantity: Int
  }

  input JobInput {
    reference: String!
    supplier: ID!   # still ID, but will resolve to Contact
    customer: ID!   # still ID, but will resolve to Contact
    date: String!
    items: [JobItemInput!]!
  }

  type Query {
    job(id: ID!): Job
    jobs: [Job!]!
  }

  type Mutation {
    createJobMutation(input: JobInput!): Job!
    updateJobMutation(id: ID!, input: JobInput!): Job!
    deleteJobMutation(id: ID!): Job!
  }

  type Subscription {
    jobAddedSubscription: Job!
    jobUpdatedSubscription: Job!
    jobDeletedSubscription: ID!
  }
`;
