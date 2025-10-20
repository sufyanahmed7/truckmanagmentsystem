import { gql } from "@apollo/client";

export const GET_ITEMS_LIST_QUERY = gql`
  query GetItemsQuery {
    items {
      _id
      name
      code
      available
      weight
      createdAt
      updatedAt
    }
  }
`;
