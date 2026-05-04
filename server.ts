import adminSeeder from "./adminSeeder.ts";
import app from "./src/app";
import { envConfig } from "./src/config/config";
import categoryController from "./src/controllers/categoryController";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./src/database/models/userModel";
import Order from "./src/database/models/orderModel";
import { databaseSync } from "./src/database/connection";
function startServer() {
  const port = envConfig.port || 4000;
  const server = app.listen(port, async () => {
    // Wait for database to sync before running seeders
    await databaseSync;
    adminSeeder();
    categoryController.seedCategory();
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  let onlineUsers: { socketId: string; userId: string; role: string }[] = [];
  let addToOnlineUsers = (socketId: string, userId: string, role: string) => {
    onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
    onlineUsers.push({ socketId, userId, role });
  };
  io.on("connection", (socket) => {
    const { token } = socket.handshake.auth; //jwt token
    if (token) {
      jwt.verify(
        token as string,
        envConfig.jwtSecretKey as string,
        async (err: any, result: any) => {
          if (err) {
            socket.emit("error", err);
          } else {
            const userData = await User.findByPk(result.userId);
            if (!userData) {
              socket.emit("error", "No user found with that token");
              return;
            }
            //userId grab garne
            addToOnlineUsers(socket.id, result.userId, userData.role);
          }
        }
      );
    } else {
      socket.emit("error", "please provide token");
    }
    socket.on("updateOrderStatus", async (data) => {
      const { status, orderId, userId } = data;

      try {
        // ALWAYS update the order status in the database first
        await Order.update(
          {
            orderStatus: status,
          },
          {
            where: {
              id: orderId,
            },
          }
        );

        // Then, emit a notification IF the user is online
        const findUser = onlineUsers.find((user) => user.userId == userId);
        if (findUser && userId) {
          io.to(findUser.socketId).emit("statusUpdated", data);
        }
      } catch (error) {
        console.error("Error updating order status:", error);
        socket.emit("error", "Failed to update order status in database");
      }
    });
  });
}
startServer();
