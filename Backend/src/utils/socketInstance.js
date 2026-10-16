let io;

export const setSocketInstance = (socketServer) => {
  io = socketServer;
};

export const getSocketInstance = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};
