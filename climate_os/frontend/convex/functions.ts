import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getEvidence = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let evidence = await ctx.db.query("evidence").collect();
    if (args.status) {
      evidence = evidence.filter((e) => e.status === args.status);
    }
    return evidence;
  },
});

export const addEvidence = mutation({
  args: {
    category: v.string(),
    content: v.string(),
    source: v.string(),
    status: v.union(v.literal("draft"), v.literal("approved"), v.literal("rejected")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("evidence", args);
  },
});

export const updateEvidenceStatus = mutation({
  args: {
    id: v.id("evidence"),
    status: v.union(v.literal("draft"), v.literal("approved"), v.literal("rejected")),
  },
  handler: async (ctx, args) => {
    const { id, status } = args;
    await ctx.db.patch(id, { status });
  },
});

export const getReports = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("reports").collect();
  },
});

export const saveReport = mutation({
  args: {
    projectName: v.string(),
    draftReport: v.string(),
    status: v.union(v.literal("draft"), v.literal("final")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reports", args);
  },
});
