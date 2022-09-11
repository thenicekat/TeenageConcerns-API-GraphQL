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
exports.CommonResolver = exports.MeReturn = void 0;
const type_graphql_1 = require("type-graphql");
let MeReturn = class MeReturn {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], MeReturn.prototype, "mentorId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MeReturn.prototype, "userId", void 0);
MeReturn = __decorate([
    (0, type_graphql_1.ObjectType)()
], MeReturn);
exports.MeReturn = MeReturn;
let CommonResolver = class CommonResolver {
    whoAmI({ req }) {
        if (req.session.isMentor) {
            return {
                mentorId: req.session.mentorId,
            };
        }
        return {
            userId: req.session.userId,
        };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => MeReturn, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommonResolver.prototype, "whoAmI", null);
CommonResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CommonResolver);
exports.CommonResolver = CommonResolver;
//# sourceMappingURL=common.resolver.js.map