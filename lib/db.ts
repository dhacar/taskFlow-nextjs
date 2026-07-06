import mongoose, { type Mongoose } from "mongoose";
import { getEnv } from "@/lib/env";

type MongooseCache = {
  connection: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cache = globalThis.mongooseCache ?? { connection: null, promise: null };

if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cache;
}

export async function connectToDatabase() {
  if (cache.connection) {
    return cache.connection;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(getEnv("MONGODB_URI"), {
      bufferCommands: false
    });
  }

  cache.connection = await cache.promise;
  return cache.connection;
}
