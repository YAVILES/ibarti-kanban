export const getLocalStorage = (fieldName: string) => {
  return localStorage.getItem(fieldName) ?? '';
};

export const setLocalStorage = (fieldName: string, value: any) => {
  localStorage.setItem(fieldName, JSON.stringify(value));
};

export const deleteLocalStorageItem = (fieldName: string) => {
  localStorage.removeItem(fieldName);
};
