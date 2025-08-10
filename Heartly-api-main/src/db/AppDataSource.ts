import { DataSource } from "typeorm";
import { User } from "../models/User";
import { Language } from "../models/Language";
import dotenv from "dotenv";
import { Expertise } from "../models/Expertise";

dotenv.config();

const dbHost: string = process.env.DB_HOST || "localhost";
const dbPort: number = parseInt(process.env.DB_PORT || "5432");
const dbUsername: string = process.env.DB_USERNAME || "postgres";
const dbPassword: string = process.env.DB_PASSWORD || "postgres";
const dbDatabase: string = process.env.DB_DATABASE || "heartlydb";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: dbHost,
  port: dbPort,
  username: dbUsername,
  password: dbPassword,
  database: dbDatabase,
  entities: [User, Language, Expertise],
  synchronize: true,
  logging: false,
});
