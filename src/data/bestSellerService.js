import SQLite from "react-native-sqlite-storage";

SQLite.DEBUG(true);
SQLite.enablePromise(true);

let db;

export const initBestSellerDB = async () => {
  try {
    db = await SQLite.openDatabase({ name: "restaurants.db", location: "default" });

    
    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS best_sellers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        restaurantId INTEGER,
        title TEXT,
        subtitle TEXT,
        price REAL,
        offer TEXT,
        image TEXT,
        category TEXT
      );`
    );

    // console.log("BestSellers table ready");
  } catch (error) {
    // console.log("DB Error:", error);
  }
};

export const addBestSeller = (restaurantId, title, price, subtitle, image, category, offer = null) => {
  if (!db) throw new Error("DB not initialized");
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO best_sellers (restaurantId, title, subtitle, price, offer, image, category) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [restaurantId, title, subtitle, price, offer, image, category],
        (_, result) => {
          // console.log("Item added with ID:", result.insertId);
          resolve(result);
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const getBestSellersByRestaurant = (restaurantId) => {
  if (!db) throw new Error("DB not initialized");
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM best_sellers WHERE restaurantId = ?",
        [restaurantId],
        (_, { rows }) => {
          const items = [];
          for (let i = 0; i < rows.length; i++) items.push(rows.item(i));
          resolve(items);
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const deleteBestSeller = (id) => {
  if (!db) throw new Error("DB not initialized");
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM best_sellers WHERE id = ?", [id], (_, result) => resolve(result), (_, error) => reject(error));
    });
  });
};

export const updateBestSeller = (id, title, subtitle, price, offer, image, category) => {
  if (!db) throw new Error("DB not initialized");
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE best_sellers SET title = ?, subtitle = ?, price = ?, offer = ?, image = ?, category = ? WHERE id = ?`,
        [title, subtitle, price, offer, image, category, id],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};
