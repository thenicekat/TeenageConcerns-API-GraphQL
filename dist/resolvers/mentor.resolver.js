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
exports.MentorResolver = exports.MentorReturn = void 0;
const Mentor_1 = require("../entity/Mentor");
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const types_1 = require("../types");
const auth_middleware_1 = require("../middleware/auth.middleware");
let MentorReturn = class MentorReturn {
};
__decorate([
    (0, type_graphql_1.Field)(() => Mentor_1.Mentor, { nullable: true }),
    __metadata("design:type", Mentor_1.Mentor)
], MentorReturn.prototype, "mentor", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [types_1.ErrorType], { nullable: true }),
    __metadata("design:type", Array)
], MentorReturn.prototype, "errors", void 0);
MentorReturn = __decorate([
    (0, type_graphql_1.ObjectType)()
], MentorReturn);
exports.MentorReturn = MentorReturn;
let MentorResolver = class MentorResolver {
    async mentorRegister(name, email, password, { db, req }) {
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
};
__decorate([
    (0, type_graphql_1.Mutation)(() => MentorReturn),
    __param(0, (0, type_graphql_1.Arg)("name")),
    __param(1, (0, type_graphql_1.Arg)("email")),
    __param(2, (0, type_graphql_1.Arg)("password")),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], MentorResolver.prototype, "mentorRegister", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => MentorReturn),
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
MentorResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], MentorResolver);
exports.MentorResolver = MentorResolver;
//# sourceMappingURL=mentor.resolver.js.map