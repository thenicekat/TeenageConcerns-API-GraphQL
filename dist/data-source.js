"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
const Mentor_1 = require("./entity/Mentor");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
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
//# sourceMappingURL=data-source.js.map