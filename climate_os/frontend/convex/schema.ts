import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  evidence: defineTable({
    category: v.string(),
    content: v.string(),
    source: v.string(),
    status: v.union(v.literal("draft"), v.literal("approved"), v.literal("rejected")),
  }),
  reports: defineTable({
    projectName: v.string(),
    draftReport: v.string(),
    status: v.union(v.literal("draft"), v.literal("final")),
  }),
});
