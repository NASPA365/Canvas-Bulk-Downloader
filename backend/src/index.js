import fetch from "node-fetch"; // npm i node-fetch if missing
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "https://haskoliislands.instructure.com/api/v1";
const HEADERS = { Authorization: `Bearer ${process.env.CANVAS_TOKEN}` };
