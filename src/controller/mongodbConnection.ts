import mongoose, { Connection, ConnectOptions } from 'mongoose';

const url = process.env.mongoDbURL || "mongodb://localhost:27017/MA-chat-app";

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



class MongoDBConnection {
  private connection: Connection | null = null;

  constructor(private url: string, private options?: ConnectOptions) { }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.url, this.options || {});
      this.connection = mongoose.connection;

      this.connection.on('error', (error: Error) => {
        console.error(`MongoDB Connection Error: ${error.message}`);
      });

      this.connection.once('open', () => {
        console.log('MongoDB connected successfully');
      });

      this.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
      });
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    try {
      if (this.connection && this.connection.readyState === 1) {
        await mongoose.disconnect();
        console.log('MongoDB connection closed gracefully');
      }
    } catch (error) {
      console.error('Error while closing MongoDB connection:', error);
      throw error;
    }
  }

  public getConnection(): Connection | null {
    return this.connection;
  }
}

// Usage example:
// const db = new MongoDBConnection('mongodb://localhost:27017/mydb');
// await db.connect();
// // ... use the database ...
// await db.close();