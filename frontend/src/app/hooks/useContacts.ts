"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CONTACTS_LIST_QUERY } from "../graphql/contacts/queries";
import { CREATE_CONTACT_MUTATION, UPDATE_CONTACT_MUTATION, DELETE_CONTACT_MUTATION } from "../graphql/contacts/mutations";
import { CREATE_CONTACT_SUBSCRIPTION, UPDATE_CONTACT_SUBSCRIPTION, DELETE_CONTACT_SUBSCRIPTION } from "../graphql/contacts/subscriptions";

export function useContacts() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [error, setError] = useState<any>(null);

  const { data, loading, subscribeToMore } = useQuery(GET_CONTACTS_LIST_QUERY);

  const [createContact] = useMutation(CREATE_CONTACT_MUTATION);
  const [updateContact] = useMutation(UPDATE_CONTACT_MUTATION);
  const [deleteContact] = useMutation(DELETE_CONTACT_MUTATION);

  useEffect(() => {
    if (!data) return;

    const unsubscribeAdded = subscribeToMore({
      document: CREATE_CONTACT_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newContact = subscriptionData.data.contactAddedSubscription;

        if (prev.contacts.find((c: any) => c._id === newContact._id)) return prev;

        return {
          ...prev,
          contacts: [...prev.contacts, newContact],
        };
      },
    });

    const unsubscribeUpdated = subscribeToMore({
      document: UPDATE_CONTACT_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const updatedContact = subscriptionData.data.contactUpdatedSubscription;

        return {
          ...prev,
          contacts: prev.contacts.map((c: any) =>
            c._id === updatedContact._id ? updatedContact : c
          ),
        };
      },
    });

    const unsubscribeDeleted = subscribeToMore({
      document: DELETE_CONTACT_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const deletedId = subscriptionData.data.contactDeletedSubscription;

        return {
          ...prev,
          contacts: prev.contacts.filter((c: any) => c._id !== deletedId),
        };
      },
    });

    return () => {
      unsubscribeAdded();
      unsubscribeUpdated();
      unsubscribeDeleted();
    };
  }, [data, subscribeToMore]);

  const saveEntry = async (entry: any) => {
    try {
      const { _id, __typename, ...inputData } = entry;

      if (_id) {
        await updateContact({ variables: { id: _id, input: inputData } });
      } else {
        await createContact({ variables: { input: inputData } });
      }
      return true;
    } catch (err: any) {
      setError(err);
      return false;
    }
  };


  const deleteEntry = async (id: string) => {
    try {
      await deleteContact({ variables: { id } });
    } catch (err: any) {
      setError(err);
    }
  };

  return {
    formList: data?.contacts ?? [],
    saveEntry,
    deleteEntry,
    error,
    setError,
    selectedIndex,
    setSelectedIndex,
    loading,
  };
}
