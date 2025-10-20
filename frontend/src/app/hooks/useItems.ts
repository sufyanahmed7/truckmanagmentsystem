"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ITEMS_LIST_QUERY } from "../graphql/Items/itemqueries";
import { CREATE_ITEM_MUTATION, UPDATE_ITEM_MUTATION, DELETE_ITEM_MUTATION } from "../graphql/Items/itemmutations";
import { ITEM_ADDED_SUBSCRIPTION, ITEM_UPDATED_SUBSCRIPTION, ITEM_DELETED_SUBSCRIPTION } from "../graphql/Items/itemsubscriptions";

export function useItems() {
  const [formList, setFormList] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { data, subscribeToMore } = useQuery(GET_ITEMS_LIST_QUERY);

  const [createItem] = useMutation(CREATE_ITEM_MUTATION);
  const [updateItem] = useMutation(UPDATE_ITEM_MUTATION);
  const [deleteItem] = useMutation(DELETE_ITEM_MUTATION);

  // Strip unwanted fields before sending to GraphQL
  const sanitizeInput = (entry: any) => {
    const { _id, __typename, createdAt, updatedAt, ...inputData } = entry;
    return inputData;
  };

  // Set initial list + wire subscriptions
  useEffect(() => {
    if (!data?.items) return;

    setFormList(data.items);
    setLoading(false);

    // ITEM_ADDED_SUBSCRIPTION
    const unsubAdded = subscribeToMore({
      document: ITEM_ADDED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newItem = subscriptionData.data.itemAddedSubscription;
        return { ...prev, items: [...prev.items, newItem] };
      },
    });

    // ITEM_UPDATED_SUBSCRIPTION
    const unsubUpdated = subscribeToMore({
      document: ITEM_UPDATED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const updatedItem = subscriptionData.data.itemUpdatedSubscription;
        return {
          ...prev,
          items: prev.items.map((i: any) =>
            i._id === updatedItem._id ? updatedItem : i
          ),
        };
      },
    });

    // ITEM_DELETED_SUBSCRIPTION
    const unsubDeleted = subscribeToMore({
      document: ITEM_DELETED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const deletedId = subscriptionData.data.itemDeletedSubscription;
        return {
          ...prev,
          items: prev.items.filter((i: any) => i._id !== deletedId),
        };
      },
    });

    return () => {
      unsubAdded();
      unsubUpdated();
      unsubDeleted();
    };
  }, [data, subscribeToMore]);
 
  const saveEntry = async (entry: any) => {
    try {
    
      const inputData = sanitizeInput(entry);

      if (entry._id) {
        await updateItem({ variables: { id: entry._id, input: inputData } });
      } else {
        await createItem({ variables: { input: inputData } });
      }

      return true;
    } catch (err: any) {
      setError(err);
      return false;
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      await deleteItem({ variables: { id } });
    } catch (err: any) {
      setError(err);
    }
  };

  return {
    formList,
    saveEntry,
    deleteEntry,
    error,
    setError,
    selectedIndex,
    setSelectedIndex,
    loading,
  };
}
