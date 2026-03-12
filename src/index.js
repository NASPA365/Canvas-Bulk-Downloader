import { readFileSync } from "fs";
import { GraphQLClient } from "graphql-request";
import dotenv from "dotenv";
dotenv.config();

const client = new GraphQLClient(
  "https://your-canvas-domain.instructure.com/api/graphql",
);
client.setHeader("Authorization", `Bearer ${process.env.CANVAS_TOKEN}`);

console.log("things kind of work...");
