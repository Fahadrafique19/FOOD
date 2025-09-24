import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "menu_items_v1";


export const getMenuItems = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    const items = json ? JSON.parse(json) : [];

    return items.map((it) => ({
      ...it,
      price: Number(it.price) || 0,
    }));
  } catch (e) {
    // console.error("Error reading items", e);
    return [];
  }
};


const saveItems = async (items) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    // console.error("Error saving items", e);
  }
};


export const addMenuItem = async (item) => {
  const items = await getMenuItems();
  const newItem = {
    ...item,
    price: Number(item.price) || 0, 
    id: item.id || Date.now(),
  };
  items.push(newItem);
  await saveItems(items);
};


export const updateMenuItem = async (updated) => {
  const items = await getMenuItems();
  const newItems = items.map((it) =>
    it.id === updated.id
      ? { ...updated, price: Number(updated.price) || 0 } 
      : it
  );
  await saveItems(newItems);
};


export const deleteMenuItem = async (id) => {
  const items = await getMenuItems();
  const newItems = items.filter((it) => it.id !== id);
  await saveItems(newItems);
};
