"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
const Mentor_1 = require("./entity/Mentor");
const constants_1 = require("./constants");
const AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: constants_1.__local__ ? "localhost" : "postgres",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "teenageconcerns",
    synchronize: true,
    logging: true,
    entities: [User_1.User, Mentor_1.Mentor],
    migrations: [],
    subscribers: [],
});
const TestDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: constants_1.__local__ ? "localhost" : "postgres",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "teenageconcerns-test",
    synchronize: true,
    logging: false,
    dropSchema: true,
    entities: [User_1.User, Mentor_1.Mentor],
    migrations: [],
    subscribers: [],
});
exports.db = (constants_1.__test__ ? TestDataSource : AppDataSource);
//# sourceMappingURL=data-source.js.map