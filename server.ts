import adminSeeder from "./adminSeeder";
import app from "./src/app";
import { envConfig } from "./src/config/config";
import categoryController from "./src/controllers/categoryController";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./src/database/models/userModel";
import Order from "./src/database/models/orderModel";
function startServer() {
  const port = envConfig.port || 4000;
  const server = app.listen(port, () => {
    console.log(`server started successfully at port [${port}]`);
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
            console.log(onlineUsers);
          }
        }
      );
    } else {
      socket.emit("error", "please provide token");
    }
    socket.on("updateOrderStatus", async (data) => {
      console.log("updateOrderStatus data", data);
      const { status, orderId, userId } = data;

      const findUser = onlineUsers.find((user) => user.userId == userId); // {socketId,userId, role}

      if (findUser) {
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
        if (userId) {
          io.to(findUser.socketId).emit("statusUpdated", data);
        }
      } else {
        socket.emit("error", "User is not online!!");
      }
    });
  });
}
startServer();
