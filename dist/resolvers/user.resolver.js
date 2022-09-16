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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = exports.UserReturn = void 0;
const type_graphql_1 = require("type-graphql");
const uuid_1 = require("uuid");
const types_1 = require("../types");
const User_1 = require("../entity/User");
const Mentor_1 = require("../entity/Mentor");
const auth_middleware_1 = require("../middleware/auth.middleware");
const sendEmail_1 = require("../utils/sendEmail");
let UserReturn = class UserReturn {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", User_1.User)
], UserReturn.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [types_1.ErrorType], { nullable: true }),
    __metadata("design:type", Array)
], UserReturn.prototype, "errors", void 0);
UserReturn = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserReturn);
exports.UserReturn = UserReturn;
let UserResolver = class UserResolver {
    async userLogin(uuid, { db, req }) {
        const resultUser = await db.getRepository(User_1.User).
            createQueryBuilder("user")
            .innerJoinAndSelect("user.mentor", "m", 'm.id = user.mentorId')
            .where({ uuid: uuid })
            .getOne();
        if (resultUser == undefined) {
            return {
                errors: [{
                        field: "user",
                        message: "User does not exist or has been deleted"
                    }]
            };
        }
        req.session.isMentor = false;
        req.session.userId = uuid;
        return { user: resultUser };
    }
    async userCreate({ db, req }) {
        const newUUID = (0, uuid_1.v4)();
        const mentors = await db.manager.find(Mentor_1.Mentor, {
            order: {
                rating: "DESC"
            }
        });
        if (mentors.length < 1) {
            return {
                errors: [{
                        field: "user",
                        message: "No Mentors Available"
                    }]
            };
        }
        let i;
        for (i = 0; i < mentors.length; i++) {
            if (mentors[i].freeToWork) {
                break;
            }
        }
        if (i >= mentors.length) {
            return {
                errors: [{
                        field: "Mentor Avaliablility",
                        message: "No Free Mentor Available"
                    }]
            };
        }
        const user = db.manager.create(User_1.User, {
            uuid: newUUID,
            mentorId: mentors[i].id
        });
        await db.manager.save(user);
        mentors[i].noOfUsers = mentors[i].noOfUsers + 1;
        await db.manager.save(mentors[i]);
        await (0, sendEmail_1.sendEmail)(mentors[i].email, user);
        const resultUser = await db.getRepository(User_1.User).
            createQueryBuilder("user")
            .innerJoinAndSelect("user.mentor", "m", 'm.id = user.mentorId')
            .where({ id: user.id })
            .getOne();
        if (resultUser == undefined) {
            return {
                errors: [{
                        field: "user",
                        message: "Error while creating user"
                    }]
            };
        }
        req.session.isMentor = false;
        req.session.userId = newUUID;
        return { user: resultUser };
    }
    async userDelete(uuid, { req, db }) {
        const user = await User_1.User.find({
            where: { uuid: uuid }
        });
        if (!user.length)
            return false;
        await User_1.User.delete({
            uuid: uuid
        });
        const mentor = await Mentor_1.Mentor.findOne({
            where: {
                id: user[0].mentorId
            }
        });
        const updatedUserLength = (mentor === null || mentor === void 0 ? void 0 : mentor.noOfUsers) && ((mentor === null || mentor === void 0 ? void 0 : mentor.noOfUsers) - 1);
        await db.manager.save(Mentor_1.Mentor, Object.assign(Object.assign({}, mentor), { noOfUsers: updatedUserLength }));
        req.session.destroy((err) => {
            return err && false;
        });
        return true;
    }
    userLogout({ req }) {
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
    (0, type_graphql_1.Mutation)(() => UserReturn),
    __param(0, (0, type_graphql_1.Arg)("uuid")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "userLogin", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserReturn),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "userCreate", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(auth_middleware_1.isAuthUser),
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('uuid')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "userDelete", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(auth_middleware_1.isAuthUser),
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "userLogout", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.resolver.js.map