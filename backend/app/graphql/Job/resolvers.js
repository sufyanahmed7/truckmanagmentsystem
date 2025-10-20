import Job from "../../models/JobSchema.js";
import Contact from "../../models/ContactSchema.js";
import Item from "../../models/ItemSchema.js";
import { pubsub } from "./pubsub.js";

const JOB_ADDED = "JOB_ADDED";
const JOB_UPDATED = "JOB_UPDATED";
const JOB_DELETED = "JOB_DELETED";

const serializeJobDate = (job) => {
  if (!job) return job;
  const jobObject = job.toObject ? job.toObject() : job;
  return { ...jobObject, date: jobObject.date ? jobObject.date.toISOString() : null };
};

export const jobResolvers = {
  Query: {
    job: async (_parent, { id }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const userId = user.payload.sub;
      const job = await Job.findOne({ _id: id, userId })
        .populate("supplier")
        .populate("customer")
        .populate("items.itemId");
      if (!job) throw new Error("Job not found");
      job.items = job.items.filter((i) => i.itemId);
      return serializeJobDate(job);
    },

    jobs: async (_parent, _args, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const userId = user.payload.sub;
      const jobs = await Job.find({ userId })
        .populate("supplier")
        .populate("customer")
        .populate("items.itemId")
        .sort({ date: -1 });
      return jobs
        .filter((j) => j.supplier && j.customer)
        .map((j) => {
          j.items = j.items.filter((i) => i.itemId);
          return serializeJobDate(j);
        });
    },
  },

  Mutation: {
    createJobMutation: async (_parent, { input }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const userId = user.payload.sub;

      const supplierExists = await Contact.exists({ _id: input.supplier, userId });
      const customerExists = await Contact.exists({ _id: input.customer, userId });
      if (!supplierExists || !customerExists) throw new Error("Supplier or customer not found for this user");

      const validItems = [];
      for (const it of input.items || []) {
        const itemExists = await Item.exists({ _id: it.itemId, userId });
        if (!itemExists) throw new Error(`Item not found: ${it.itemId}`);
        validItems.push(it);
      }

      const jobData = { ...input, items: validItems, userId, date: input.date ? new Date(input.date) : new Date() };
      try {
        const job = new Job(jobData);
        const saved = await job.save();
        const populated = await saved.populate(["supplier", "customer", "items.itemId"]);
        const serializedJob = serializeJobDate(populated);
        pubsub.publish(JOB_ADDED, { jobAddedSubscription: serializedJob });
        return serializedJob;
      } catch (error) {
        if (error.code === 11000) throw new Error(`Reference '${input.reference}' already exists. Please use a unique reference.`);
        throw error;
      }
    },

    updateJobMutation: async (_parent, { id, input }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const userId = user.payload.sub;

      const supplierExists = await Contact.exists({ _id: input.supplier, userId });
      const customerExists = await Contact.exists({ _id: input.customer, userId });
      if (!supplierExists || !customerExists) throw new Error("Supplier or customer not found for this user");

      const validItems = [];
      for (const it of input.items || []) {
        const itemExists = await Item.exists({ _id: it.itemId, userId });
        if (!itemExists) throw new Error(`Item not found: ${it.itemId}`);
        validItems.push(it);
      }

      const updateData = { ...input, items: validItems, date: input.date ? new Date(input.date) : input.date };
      try {
        const updated = await Job.findOneAndUpdate({ _id: id, userId }, updateData, { new: true, runValidators: true })
          .populate(["supplier", "customer", "items.itemId"]);
        if (!updated) throw new Error("Job not found");
        const serializedJob = serializeJobDate(updated);
        pubsub.publish(JOB_UPDATED, { jobUpdatedSubscription: serializedJob });
        return serializedJob;
      } catch (error) {
        if (error.code === 11000) throw new Error(`Reference '${input.reference}' already exists. Please use a unique reference.`);
        throw error;
      }
    },

    deleteJobMutation: async (_parent, { id }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      const userId = user.payload.sub;
      const deleted = await Job.findOneAndDelete({ _id: id, userId })
        .populate(["supplier", "customer", "items.itemId"]);
      if (!deleted) throw new Error("Job not found");
      pubsub.publish(JOB_DELETED, { jobDeletedSubscription: id });
      return serializeJobDate(deleted);
    },
  },

  Subscription: {
    jobAddedSubscription: {
      subscribe: () => pubsub.asyncIterableIterator([JOB_ADDED]),
    },
    jobUpdatedSubscription: {
      subscribe: () => pubsub.asyncIterableIterator([JOB_UPDATED]),
    },
    jobDeletedSubscription: {
      subscribe: () => pubsub.asyncIterableIterator([JOB_DELETED]),
    },
  },
};
