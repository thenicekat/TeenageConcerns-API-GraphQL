import "reflect-metadata";
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Mentor } from './entity/Mentor';
import { __local__, __test__ } from "./constants";

const AppDataSource = new DataSource({
    type: "postgres",
    host: __local__ ? "localhost" : "postgres",
    port: 5432,
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PSWD || "postgres",
    database: "teenageconcerns",
    synchronize: true,
    logging: true,
    dropSchema: false,
    entities: [User, Mentor],
    migrations: [],
    subscribers: [],
})

const TestDataSource = new DataSource({
    type: "postgres",
    host: __local__ ? "localhost" : "postgres",
    port: 5432,
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PSWD || "postgres",
    database: "teenageconcerns-test",
    synchronize: true,
    logging: false,
    dropSchema: true,
    entities: [User, Mentor],
    migrations: [],
    subscribers: [],
})

export const db = (__test__ ? TestDataSource : AppDataSource);