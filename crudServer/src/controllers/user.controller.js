import fs from "fs";
import crypto from "crypto";

const FILE_PATH = "./src/data/usersData.json";

/* ---------------- CREATE USER ---------------- */

const createUser = (req, res) => {
  let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", () => {
    let newUser;

    try {
      newUser = JSON.parse(body);
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Invalid JSON" }));
    }

    newUser.id = crypto.randomUUID();

    fs.readFile(FILE_PATH, "utf-8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Internal Server Error" }));
      }

      let users = [];
      try {
        users = JSON.parse(data || "[]");
      } catch {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Corrupted JSON file" }));
      }

      users.push(newUser);

      fs.writeFile(FILE_PATH, JSON.stringify(users, null, 2), err => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ message: "Internal Server Error" }));
        }

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newUser));
      });
    });
  });
};

/* ---------------- GET USERS ---------------- */

const getUsers = (req, res) => {
  fs.readFile(FILE_PATH, "utf-8", (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Internal Server Error" }));
    }

    let users = [];
    try {
      users = JSON.parse(data || "[]");
    } catch {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Corrupted JSON file" }));
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  });
};

/* ---------------- UPDATE USER ---------------- */

const updateUser = (req, res, id) => {
  let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", () => {
    let updatedData;

    try {
      updatedData = JSON.parse(body);
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Invalid JSON" }));
    }

    fs.readFile(FILE_PATH, "utf-8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Internal Server Error" }));
      }

      let users;
      try {
        users = JSON.parse(data || "[]");
      } catch {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Corrupted JSON file" }));
      }

      const index = users.findIndex(u => toString(u.id) === toString(id));

      if (index === -1) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "User not found" }));
      }

      const updatedUser = {
        ...users[index],
        ...updatedData
      };

      users[index] = updatedUser;

      fs.writeFile(FILE_PATH, JSON.stringify(users, null, 2), err => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ message: "Internal Server Error" }));
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(updatedUser));
      });
    });
  });
};


/* ---------------- DELETE USER ---------------- */

const deleteUser = (req, res, id) => {
  fs.readFile(FILE_PATH, "utf-8", (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Internal Server Error" }));
    }

    let users = [];
    try {
      users = JSON.parse(data || "[]");
    } catch {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Corrupted JSON file" }));
    }

    const userId = Number(id);

    const userToDelete = users.find(u => toString(u.id) === toString(userId));

    if (!userToDelete) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "User not found" }));
    }

    const filteredUsers = users.filter(
      user => Number(user.id) !== userId
    );

    fs.writeFile(FILE_PATH, JSON.stringify(filteredUsers, null, 2), err => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Internal Server Error" }));
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "User deleted successfully",
          deletedUser: userToDelete
        })
      );
    });
  });
};


export default {
  createUser,
  getUsers,
  updateUser,
  deleteUser
};
