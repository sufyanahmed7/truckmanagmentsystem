import { gql } from "@apollo/client";

// Create
export const CREATE_CONTACT_SUBSCRIPTION = gql`
  subscription ContactAddedSubscription {
    contactAddedSubscription {
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
export const UPDATE_CONTACT_SUBSCRIPTION = gql`
  subscription ContactUpdatedSubscription {
    contactUpdatedSubscription {
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
export const DELETE_CONTACT_SUBSCRIPTION = gql`
  subscription ContactDeletedSubscription {
    contactDeletedSubscription
  }
`;
