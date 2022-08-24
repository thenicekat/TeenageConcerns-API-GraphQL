import "reflect-metadata";
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Mentor } from './entity/Mentor';
import { __test__ } from "./constants";

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "teenageconcerns",
    synchronize: true,
    logging: true,
    entities: [User, Mentor],
    migrations: [],
    subscribers: [],
})

const TestDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "teenageconcerns-test",
    synchronize: true,
    logging: false,
    dropSchema: true,
    entities: [User, Mentor],
    migrations: [],
    subscribers: [],
})

export const db = (__test__ ? TestDataSource : AppDataSource);