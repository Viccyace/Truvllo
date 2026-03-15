export const defaultCategories = [
  'Food',
  'Transport',
  'Shopping',
  'Housing',
  'Health',
  'Education',
  'Entertainment',
  'Savings',
  'Utilities',
  'Other',
] as const;

export type Category = typeof defaultCategories[number];
