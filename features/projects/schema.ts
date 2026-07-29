import { z } from "zod";
import {
  MAX_PROJECT_YEAR,
  MIN_PROJECT_YEAR,
  PROJECT_CODE_REGEX,
} from "./constants";

export const CreateProjectSchema = z.object({
  code: z
    .string()
    .min(1)
    .max(30)
    .regex(PROJECT_CODE_REGEX),

  name: z
    .string()
    .min(1)
    .max(255),

  customer: z
    .string()
    .max(255)
    .optional(),

  year: z
    .number()
    .min(MIN_PROJECT_YEAR)
    .max(MAX_PROJECT_YEAR),

  description: z
    .string()
    .max(2000)
    .optional(),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;