"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorResolver = void 0;
const Mentor_1 = require("../entity/Mentor");
const types_1 = require("../types");
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("./../middleware/validate.middleware");
const User_1 = require("./../entity/User");
let MentorResolver = class MentorResolver {
    async mentorList({ db }) {
        const mentors = await db.getRepository(Mentor_1.Mentor)
            .createQueryBuilder("mentor")
            .leftJoinAndSelect("mentor.users", "user")
            .getMany();
        return mentors;
    }
    async mentorRegister(name, email, password, { db, req }) {
        if (!name || !email || !password) {
            return {
                errors: [
                    {
                        field: "all",
                        message: "Invalid Form of Credentials",
                    },
                ],
            };
        }
        const hash = await argon2_1.default.hash(password);
        const mentor = db.manager.create(Mentor_1.Mentor, {
            name,
            email,
            password: hash,
            users: [],
        });
        try {
            await db.manager.save(mentor);
        }
        catch (e) {
            if (e.message.includes("duplicate key value")) {
                return {
                    errors: [
                        {
                            field: "email",
                            message: "Account already exists",
                        },
                    ],
                };
            }
        }
        req.session.isMentor = true;
        req.session.mentorId = mentor.id;
        return { mentor };
    }
    async mentorLogin(email, password, { db, req }) {
        if (!email || !password) {
            return {
                errors: [
                    {
                        field: "all",
                        message: "Invalid Form of Credentials",
                    },
                ],
            };
        }
        const mentor = await db
            .getRepository(Mentor_1.Mentor)
            .createQueryBuilder("mentor")
            .leftJoinAndSelect("mentor.users", "user")
            .where("user.mentorId = mentor.id")
            .where("mentor.email = :email", { email: email })
            .getOne();
        if (!mentor) {
            return {
                errors: [
                    {
                        field: "email",
                        message: "account doesn't exist",
                    },
                ],
            };
        }
        const verified = await argon2_1.default.verify(mentor.password, password);
        if (!verified) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "password doesn't match",
                    },
                ],
            };
        }
        req.session.isMentor = true;
        req.session.mentorId = mentor.id;
        return { mentor };
    }
    mentorLogout({ req }) {
        return new Promise((res) => req.session.destroy((err) => {
            if (err) {
                console.log(err);
                res(false);
            }
            res(true);
        }));
    }
    async mentorRate(rating, id, { db, req }) {
        const mentor = await db.getRepository(Mentor_1.Mentor).findOne({
            where: { id: id }
        });
        const user = await db.getRepository(User_1.User).findOne({
            where: {
                id: Number(req.session.userId)
            }
        });
        if (!user) {
            throw Error("Invalid User");
        }
        user.rating = rating;
        await db.manager.save(User_1.User, user);
        if (!mentor) {
            return 0;
        }
        const newRating = (mentor === null || mentor === void 0 ? void 0 : mentor.rating) == 0 ? rating : ((Number(mentor === null || mentor === void 0 ? void 0 : mentor.rating) + rating));
        const res = await db.manager.save(Mentor_1.Mentor, {
            id: id,
            rating: newRating
        });
        if (res)
            return newRating / mentor.noOfUsers;
        return 0;
    }
    async mentorChangeWorkState(id, { db }) {
        const mentor = await db.getRepository(Mentor_1.Mentor).findOne({
            where: { id: id }
        });
        if (!mentor)
            return false;
        const currState = mentor === null || mentor === void 0 ? void 0 : mentor.freeToWork;
        const newState = !currState;
        const newMentor = Object.assign(Object.assign({}, mentor), { freeToWork: newState });
        await db.manager.save(Mentor_1.Mentor, newMentor);
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => [Mentor_1.Mentor]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MentorResolver.prototype, "mentorList", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(validate_middleware_1.isValidated),
    (0, type_graphql_1.Mutation)(() => types_1.MentorReturn),
    __param(0, (0, type_graphql_1.Arg)("name")),
    __param(1, (0, type_graphql_1.Arg)("email")),
    __param(2, (0, type_graphql_1.Arg)("password")),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], MentorResolver.prototype, "mentorRegister", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(validate_middleware_1.isValidated),
    (0, type_graphql_1.Mutation)(() => types_1.MentorReturn),
    __param(0, (0, type_graphql_1.Arg)("email")),
    __param(1, (0, type_graphql_1.Arg)("password")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MentorResolver.prototype, "mentorLogin", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(auth_middleware_1.isAuthMentor),
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MentorResolver.prototype, "mentorLogout", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(auth_middleware_1.isAuthUser),
    (0, type_graphql_1.Mutation)(() => Number),
    __param(0, (0, type_graphql_1.Arg)("rating")),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], MentorResolver.prototype, "mentorRate", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MentorResolver.prototype, "mentorChangeWorkState", null);
MentorResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], MentorResolver);
exports.MentorResolver = MentorResolver;
//# sourceMappingURL=mentor.resolver.js.map