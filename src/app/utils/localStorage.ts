export const getLocalStorage = (fieldName: string) => {
  const data = localStorage.getItem(fieldName);
  return data ? JSON.parse(data) : null;
};

export const setLocalStorage = (fieldName: string, value: any) => {
  localStorage.setItem(fieldName, JSON.stringify(value));
};

export const deleteLocalStorageItem = (fieldName: string) => {
  localStorage.removeItem(fieldName);
};
