import { gql } from "@apollo/client";

// Create
export const CREATE_ITEM_MUTATION = gql`
  mutation CreateItemMutation($input: ItemInput!) {
    createItemMutation(input: $input) {
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

// Update
export const UPDATE_ITEM_MUTATION = gql`
  mutation UpdateItemMutation($id: ID!, $input: ItemInput!) {
    updateItemMutation(id: $id, input: $input) {
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

// Delete
export const DELETE_ITEM_MUTATION = gql`
  mutation DeleteItemMutation($id: ID!) {
    deleteItemMutation(id: $id)
  }
`;
