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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GauthUserinfo = exports.MentorReturn = exports.UserReturn = exports.ErrorType = void 0;
const type_graphql_1 = require("type-graphql");
const User_1 = require("./entity/User");
const Mentor_1 = require("./entity/Mentor");
let ErrorType = class ErrorType {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ErrorType.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ErrorType.prototype, "message", void 0);
ErrorType = __decorate([
    (0, type_graphql_1.ObjectType)()
], ErrorType);
exports.ErrorType = ErrorType;
let UserReturn = class UserReturn {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", User_1.User)
], UserReturn.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ErrorType], { nullable: true }),
    __metadata("design:type", Array)
], UserReturn.prototype, "errors", void 0);
UserReturn = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserReturn);
exports.UserReturn = UserReturn;
let MentorReturn = class MentorReturn {
};
__decorate([
    (0, type_graphql_1.Field)(() => Mentor_1.Mentor, { nullable: true }),
    __metadata("design:type", Mentor_1.Mentor)
], MentorReturn.prototype, "mentor", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ErrorType], { nullable: true }),
    __metadata("design:type", Array)
], MentorReturn.prototype, "errors", void 0);
MentorReturn = __decorate([
    (0, type_graphql_1.ObjectType)()
], MentorReturn);
exports.MentorReturn = MentorReturn;
let GauthUserinfo = class GauthUserinfo {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], GauthUserinfo.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], GauthUserinfo.prototype, "family_name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], GauthUserinfo.prototype, "gender", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], GauthUserinfo.prototype, "given_name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], GauthUserinfo.prototype, "hd", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], GauthUserinfo.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], GauthUserinfo.prototype, "link", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], GauthUserinfo.prototype, "locale", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], GauthUserinfo.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], GauthUserinfo.prototype, "picture", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Object)
], GauthUserinfo.prototype, "verified_email", void 0);
GauthUserinfo = __decorate([
    (0, type_graphql_1.ObjectType)()
], GauthUserinfo);
exports.GauthUserinfo = GauthUserinfo;
//# sourceMappingURL=types.js.map