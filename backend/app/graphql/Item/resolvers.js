import Item from "../../models/ItemSchema.js";
import { pubsub } from "./pubsub.js"; 

const ITEM_ADDED = "ITEM_ADDED";
const ITEM_UPDATED = "ITEM_UPDATED";
const ITEM_DELETED = "ITEM_DELETED";

export const itemResolvers = {
  Query: {
    // Get all items for logged-in user
    items: async (_parent, { q }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const userId = user.payload.sub;

      const filter = { userId };
      if (q && q.length >= 2) {
        filter.$or = [
          { name: { $regex: q, $options: "i" } },
          { code: { $regex: q, $options: "i" } },
        ];
      }

      return await Item.find(filter).sort({ createdAt: -1 });
    },

    // Get single item for logged-in user
    item: async (_parent, { id }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const userId = user.payload.sub;
      return await Item.findOne({ _id: id, userId });
    },
  },

  Mutation: {
    createItemMutation: async (_parent, { input }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const userId = user.payload.sub;

      const newItem = new Item({ ...input, userId });
      const saved = await newItem.save();

      pubsub.publish(ITEM_ADDED, { itemAddedSubscription: saved });
      return saved;
    },

    updateItemMutation: async (_parent, { id, input }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const userId = user.payload.sub;

      const updated = await Item.findOneAndUpdate(
        { _id: id, userId },
        { $set: input },
        { new: true, runValidators: true }
      );

      if (!updated) throw new Error("Item not found");
      pubsub.publish(ITEM_UPDATED, { itemUpdatedSubscription: updated });

      return updated;
    },

    deleteItemMutation: async (_parent, { id }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const userId = user.payload.sub;

      const deleted = await Item.findOneAndDelete({ _id: id, userId });
      if (!deleted) throw new Error("Item not found");

      pubsub.publish(ITEM_DELETED, { itemDeletedSubscription: id });
      return id;
    },
  },

  Subscription: {
    itemAddedSubscription: {
      subscribe: () => pubsub.asyncIterableIterator([ITEM_ADDED]),
    },
    itemUpdatedSubscription: {
      subscribe: () => pubsub.asyncIterableIterator([ITEM_UPDATED]),
    },
    itemDeletedSubscription: {
      subscribe: () => pubsub.asyncIterableIterator([ITEM_DELETED]),
    },
  },
};
