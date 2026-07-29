export const PROJECT_STATUS = {
  PLANNING: "PLANNING",
  ACTIVE: "ACTIVE",
  ARCHIVED: "ARCHIVED",
} as const;

export const PROJECT_CODE_REGEX = /^[A-Z0-9_-]+$/;

export const MIN_PROJECT_YEAR = 2020;

export const MAX_PROJECT_YEAR = 2100;