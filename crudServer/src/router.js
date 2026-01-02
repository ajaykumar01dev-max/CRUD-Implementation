import userController from "./controllers/user.controller.js";

export const handleRequest = (req, res) => {

  let myURL = new URL(req.url, "http://localhost:8080")
  let userID;

  if (myURL.pathname === "/favicon.ico") {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === "GET" && myURL.pathname === "/user") {
    return userController.getUsers(req, res)
  }
  if (req.method === "POST" && myURL.pathname === "/user") {
    return userController.createUser(req, res)
  }
  if (req.method === "PUT" && myURL.pathname === "/user") {
    userID = myURL.searchParams.get("userID")
    return userController.updateUser(req, res, userID)
  }
  if (req.method === "DELETE" && myURL.pathname === "/user") {
    userID = myURL.searchParams.get("userID")
    return userController.deleteUser(req, res, userID)
  }
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route not found" }));
};
