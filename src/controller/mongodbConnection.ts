import mongoose from "mongoose";

const url = process.env.mongoDbURL || "mongodb://localhost:27017/message";

async function mongoDBconnection() {
  mongoose.connect(url);

  mongoose.connection.on("error", (err: any) => {
    console.log(`Connection error at @${err}`);
  });

  mongoose.connection.once("open", () => {
    console.log("MongoDB is Connnected");
  });
}

export default mongoDBconnection;
