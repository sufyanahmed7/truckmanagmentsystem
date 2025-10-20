import { gql } from "@apollo/client";

// Item Added
export const ITEM_ADDED_SUBSCRIPTION = gql`
  subscription ItemAddedSubscription {
    itemAddedSubscription {
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

// Item Updated
export const ITEM_UPDATED_SUBSCRIPTION = gql`
  subscription ItemUpdatedSubscription {
    itemUpdatedSubscription {
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

// Item Deleted
export const ITEM_DELETED_SUBSCRIPTION = gql`
  subscription ItemDeletedSubscription {
    itemDeletedSubscription
  }
`;
