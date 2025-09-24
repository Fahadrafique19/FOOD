
import SQLite from "react-native-sqlite-storage";

SQLite.DEBUG(true);
SQLite.enablePromise(true);

let db = null;


export const initDB = async () => {
  try {
    db = await SQLite.openDatabase({ name: "users.db", location: "default" });
    console.log("DB opened");

    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT,
        email TEXT UNIQUE,
        password TEXT
      );`
    );
    console.log("Table ready");
  } catch (error) {
    console.log("DB error:", error);
  }
};


export const registerUser = async (fullName, email, password) => {
  if (!db) throw new Error("Database not ready");

  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)",
          [fullName, email, password],
          (_, result) => resolve(true),
          (_, error) => {
            if (error.message.includes("UNIQUE constraint failed")) {
              reject(new Error("Email already exists"));
            } else {
              reject(new Error("Database error"));
            }
          }
        );
      },
      (err) => reject(new Error("DB transaction failed"))
    );
  });
};


export const loginUser = async (email, password) => {
  if (!db) throw new Error("Database not ready");

  
  if (email === "admin@food.com" && password === "admin123") {
    return { isAdmin: true, fullName: "Admin", email };
  }

  try {
    const [results] = await db.executeSql(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (results.rows.length === 0) {
      throw new Error("User not registered. Please sign up first.");
    }

    const user = results.rows.item(0);
    if (user.password !== password) throw new Error("Incorrect password");

    return { ...user, isAdmin: false };
  } catch (error) {
    throw error;
  }
};
