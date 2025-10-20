import { gql } from "@apollo/client";

export const GET_CONTACTS_LIST_QUERY = gql`
  query GetContactsQuery {
    contacts {
      _id
      account
      company
      email
      phone
      firstName
      lastName
      type
    }
  }
`;
