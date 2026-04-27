export const format = (error) => {
  if (!import.meta.env.DEV) return;
  // eslint-disable-next-line no-console
  console.error("[Expenzo API Error]", error?.response || error?.message || error);
};

