import { gql } from "@apollo/client";

export const CREATE_JOB_MUTATION = gql`
  mutation CreateJobMutation($input: JobInput!) {
    createJobMutation(input: $input) {
      _id
      reference
      supplier {
        _id
        account
        firstName
        lastName
      }
      customer {
        _id
        account
        firstName
        lastName
      }
      date
      items {
        itemId {
          _id
          name
          code
        }
        price
        quantity
      }
    }
  }
`;

export const UPDATE_JOB_MUTATION = gql`
  mutation UpdateJobMutation($id: ID!, $input: JobInput!) {
    updateJobMutation(id: $id, input: $input) {
      _id
      reference
      supplier {
        _id
        account
        firstName
        lastName
      }
      customer {
        _id
        account
        firstName
        lastName
      }
      date
      items {
        itemId {
          _id
          name
          code
        }
        price
        quantity
      }
    }
  }
`;

export const DELETE_JOB_MUTATION = gql`
  mutation DeleteJobMutation($id: ID!) {
    deleteJobMutation(id: $id) {
      _id
    }
  }
`;
