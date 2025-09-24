// import SQLite from "react-native-sqlite-storage";

// SQLite.DEBUG(true);
// SQLite.enablePromise(true);

// let db = null;

// export const initRestaurantDB = async () => {
//   try {
//     if (!db) {
//       db = await SQLite.openDatabase({ name: "restaurants.db", location: "default" });
//     }

//     // Create tables
//     await db.executeSql(`
//       CREATE TABLE IF NOT EXISTS nearest_restaurants (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT,
//         image TEXT,
//         discount TEXT,
//         rating REAL,
//         time TEXT
//       )
//     `);

//     await db.executeSql(`
//       CREATE TABLE IF NOT EXISTS popular_restaurants (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT,
//         image TEXT,
//         discount TEXT,
//         rating REAL,
//         time TEXT
//       )
//     `);

//     // Insert sample data if empty
//     const [nearestRes] = await db.executeSql("SELECT COUNT(*) as count FROM nearest_restaurants");
//     if (nearestRes.rows.item(0).count === 0) {
//       const nearestData = [
//         ["Pizza Place", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJi88a-9Ke2AHALSOaV6fa3ZnueU2zsxCRlg&s", "10% off", 4.5, "15-20 min"],
//         ["Sushi Bar", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRddXcUETc2t4JBDptaPMGOJROAIC2XX2Phew&s", "15% off", 4.8, "20-25 min"],
//         ["Coffee House", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnDL__fpdiU2MVm_g4thEXqtkIqDDf4YBSgQ&s", "5% off", 4.2, "10-15 min"],
//         ["Burger House", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmKFDuZ4YnrZ-FUv7qjNjYV1smSuFeZ4CMuA&s", "12% off", 4.6, "15-20 min"],
//         ["Taco Spot", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4pSExMTWup4nfXqdI5V9_OC99-eonB4N6-g&s", "8% off", 4.4, "10-15 min"],
//       ];
//       for (const item of nearestData) {
//         await db.executeSql(
//           "INSERT INTO nearest_restaurants (name, image, discount, rating, time) VALUES (?, ?, ?, ?, ?)",
//           item
//         );
//       }
//     }

//     const [popularRes] = await db.executeSql("SELECT COUNT(*) as count FROM popular_restaurants");
//     if (popularRes.rows.item(0).count === 0) {
//       const popularData = [
//         ["Italian Delight", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBLbRXP0NepN8iexGjAzHZQSJAReL28KHkNA&s", "20% off", 4.9, "25-30 min"],
//         ["Veggie Garden", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBLbRXP0NepN8iexGjAzHZQSJAReL28KHkNA&s", "10% off", 4.7, "15-20 min"],
//         ["Steak House", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlbCCBn_zUd50ZX3jFDn9TJDhU9yR4eZZqRg&s", "15% off", 4.8, "30-35 min"],
//         ["Seafood Shack", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGFYRAPCgug3DtC6Y_xMMrj1HXnx4BstZNlQ&s", "12% off", 4.6, "20-25 min"],
//         ["Dessert Hub", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-WKIMZrrVxfUYGQ1gDhPwyq50W0YZDV6qBA&s", "5% off", 4.5, "10-15 min"],
//       ];
//       for (const item of popularData) {
//         await db.executeSql(
//           "INSERT INTO popular_restaurants (name, image, discount, rating, time) VALUES (?, ?, ?, ?, ?)",
//           item
//         );
//       }
//     }

//     console.log("Database initialized");
//   } catch (err) {
//     console.log("DB error:", err);
//   }
// };

// export const getNearestRestaurants = async () => {
//   if (!db) await initRestaurantDB();
//   const [res] = await db.executeSql("SELECT * FROM nearest_restaurants");
//   const data = [];
//   for (let i = 0; i < res.rows.length; i++) {
//     data.push(res.rows.item(i));
//   }
//   return data;
// };

// export const getPopularRestaurants = async () => {
//   if (!db) await initRestaurantDB();
//   const [res] = await db.executeSql("SELECT * FROM popular_restaurants");
//   const data = [];
//   for (let i = 0; i < res.rows.length; i++) {
//     data.push(res.rows.item(i));
//   }
//   return data;
// };
