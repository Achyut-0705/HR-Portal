import z from "zod";

export const userRoleSchema = z.enum(["user", "admin", "super_admin"]);
export const userStatusSchema = z.enum(["active", "restricted"]);

export const userCreateSchema = z.object({
  username: z.string().trim(),
  name: z.string().trim(),
  email: z.string().trim().email(),
  password: z.string().trim(),
});

export const userSchema = z.object({
  id: z.string().trim(),
  organizationName: z.string().trim(),
  username: z.string().trim(),
  name: z.string().trim(),
  email: z.string().trim().email(),
  role: userRoleSchema,
  status: userStatusSchema,
});

export const userDBSchema = userSchema.extend({
  password: z.string().trim(),
  userActivityHistory: z.object({
    chatbotUpdateHistory: z.array(z.any()),
    assistantDetailsUpdateHistory: z.array(z.any()),
    chatSettingsUpdateHistory: z.array(z.any()),
    confidenceScoreThresholdUpdateHistory: z.array(z.any()),
    isCoPilotOnUpdateHistory: z.array(z.any()),
    isModelSelectionOnUpdateHistory: z.array(z.any()),
    feedbackSectionHistory: z.array(z.any()),
    ApprovalSectionHistory: z.array(z.any()),
  }),
});

export type TUserRole = z.infer<typeof userRoleSchema>;
export type TUserStatus = z.infer<typeof userStatusSchema>;
export type TUserCreationPayload = z.infer<typeof userCreateSchema>;
export type TUser = z.infer<typeof userSchema>;
export type TUSerSchema = z.infer<typeof userDBSchema>;
