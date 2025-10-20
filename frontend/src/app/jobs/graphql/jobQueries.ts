import { gql } from "@apollo/client";

export const GET_JOBS_DATA_QUERY = gql`
  query GetJobsDataQuery {
    contacts {
      _id
      account
      company
      firstName
      lastName
      email
      phone
      type
    }
    items {
      _id
      name
      code
      available
      weight
    }
    jobs {
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
