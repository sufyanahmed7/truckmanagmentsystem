import Contact from "../../models/ContactSchema.js";
import { pubsub } from "./pubsub.js";

const CONTACT_ADDED = "CONTACT_ADDED";
const CONTACT_UPDATED = "CONTACT_UPDATED";
const CONTACT_DELETED = "CONTACT_DELETED";

export const contactResolvers = {
  Query: {
    contacts: async (_parent, { q }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const userId = user.payload.sub;

      const filter = { userId };

      if (q && q.length >= 2) {
        filter.$or = [
          { account: { $regex: q, $options: "i" } },
          { company: { $regex: q, $options: "i" } },
        ];
      }

      return await Contact.find(filter).sort({ createdAt: -1 });
    },
    contact: async (_parent, { id }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      return await Contact.findOne({ _id: id, userId: user.payload.sub });
    },
    me: (_parent, _args, { user }) => user || null,
  },

  Mutation: {
    createContactMutation: async (_parent, { input }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const userId = user.payload.sub;

      const existing = await Contact.findOne({ account: input.account, userId });
      if (existing) throw new Error("Record already exists");

      const newContact = new Contact({ ...input, userId });
      const saved = await newContact.save();

      pubsub.publish(CONTACT_ADDED, { contactAddedSubscription: saved });
      return saved;
    },

    updateContactMutation: async (_parent, { id, input }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const userId = user.payload.sub;

      const updated = await Contact.findOneAndUpdate(
        { _id: id, userId },
        { $set: input },
        { new: true, runValidators: true }
      );

      if (!updated) throw new Error("Contact not found");

      pubsub.publish(CONTACT_UPDATED, { contactUpdatedSubscription: updated });
      return updated;
    },

    deleteContactMutation: async (_parent, { id }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const userId = user.payload.sub;

      const deleted = await Contact.findOneAndDelete({ _id: id, userId });
      if (!deleted) throw new Error("Contact not found");

      pubsub.publish(CONTACT_DELETED, { contactDeletedSubscription: id });
      return id;
    },
  },

  Subscription: {
    contactAddedSubscription: {
      subscribe: () => pubsub.asyncIterableIterator([CONTACT_ADDED]),
    },
    contactUpdatedSubscription: {
      subscribe: () => pubsub.asyncIterableIterator([CONTACT_UPDATED]),
    },
    contactDeletedSubscription: {
      subscribe: () => pubsub.asyncIterableIterator([CONTACT_DELETED]),
    },
  },
};
