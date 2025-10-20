import { gql } from "@apollo/client";

// Create
export const CREATE_CONTACT_MUTATION = gql`
  mutation CreateContactMutation($input: ContactInput!) {
    createContactMutation(input: $input) {
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

// Update
export const UPDATE_CONTACT_MUTATION = gql`
  mutation UpdateContactMutation($id: ID!, $input: UpdateContactInput!) {
    updateContactMutation(id: $id, input: $input) {
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

// Delete
export const DELETE_CONTACT_MUTATION = gql`
  mutation DeleteContactMutation($id: ID!) {
    deleteContactMutation(id: $id)
  }
`;
