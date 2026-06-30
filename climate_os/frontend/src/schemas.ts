import { z } from "zod";

export const EvidenceItemSchema = z.object({
  category: z.string(),
  content: z.string(),
  source: z.string().optional().default("meeting_notes"),
  status: z.enum(["draft", "approved", "rejected"]).optional(),
});

export const ExtractResponseSchema = z.object({
  evidence: z.array(EvidenceItemSchema),
});

export const GenerateReportResponseSchema = z.object({
  draft_report: z.string(),
});

export const QAFlagSchema = z.object({
  flag_type: z.string(),
  description: z.string(),
  severity: z.string(),
});

export const QAReviewResponseSchema = z.object({
  flags: z.array(QAFlagSchema),
  passed: z.boolean(),
});

export const RewriteResponseSchema = z.object({
  rewritten_report: z.string(),
});

export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;
export type RewriteResponse = z.infer<typeof RewriteResponseSchema>;
export type QAReviewResponse = z.infer<typeof QAReviewResponseSchema>;
export type QAFlag = z.infer<typeof QAFlagSchema>;
