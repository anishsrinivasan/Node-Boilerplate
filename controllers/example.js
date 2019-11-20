const jwt = require("../services/jwt");

class ExampleController {
  constructor(db) {
    this.db = db;
  }

  create(phone, school_id) {
    return new Promise(async (resolve, reject) => {
      const query = "INSERT INTO users (phone, school_id) VALUES (?, ?)";
      this.db.query(query, [phone, school_id], async (err, result) => {
        if (err) {
          reject(err);
        } else {
          const token = await jwt.sign(
            { id: result.insertId, school_id: school_id, role: "USER" },
            "30d"
          );
          resolve(token);
        }
      });
    });
  }

  update(user_id, pickup_vehicle_id, drop_vehicle_id) {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE users SET pickup_vehicle_id = ?, drop_vehicle_id = ? WHERE id = ?";
      this.db.query(
        query,
        [pickup_vehicle_id, drop_vehicle_id, user_id],
        (err, result) => {
          if (err) {
            reject(err);
            return;
          } else {
            resolve();
          }
        }
      );
    });
  }

  get(user_id, trip) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT drop_vehicle_id AS vehicle_id FROM users WHERE id = ?";

      this.db.query(query, [user_id], (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        const room = "room-" + result[0].vehicle_id;

        resolve(room);
      });
    });
  }

  destroy(user_id, trip) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM drop_vehicle_id  WHERE id = ?";

      this.db.query(query, [user_id], (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(room);
      });
    });
  }
}

module.exports = db => {
  return new ExampleController(db);
};
