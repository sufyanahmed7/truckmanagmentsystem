import { gql } from "@apollo/client";

export const JOB_ADDED_SUBSCRIPTION = gql`
  subscription JobAddedSubscription {
    jobAddedSubscription {
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

export const JOB_UPDATED_SUBSCRIPTION = gql`
  subscription JobUpdatedSubscription {
    jobUpdatedSubscription {
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

export const JOB_DELETED_SUBSCRIPTION = gql`
  subscription JobDeletedSubscription {
    jobDeletedSubscription
  }
`;
