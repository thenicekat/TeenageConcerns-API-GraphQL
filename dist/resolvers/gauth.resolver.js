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
exports.GoogleAuthResolver = void 0;
const googleapis_1 = require("googleapis");
const types_1 = require("../types");
const type_graphql_1 = require("type-graphql");
const constants_1 = require("./../constants");
const oauth2Client = new googleapis_1.google.auth.OAuth2(constants_1.GAUTH_CLIENT_ID, constants_1.GAUTH_CLIENT_SECRET, constants_1.GAUTH_REDIRECT_URL);
let GoogleAuthResolver = class GoogleAuthResolver {
    getGoogleAuthURL() {
        const scopes = [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ];
        const authorizationUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true
        });
        return authorizationUrl;
    }
    async getGoogleUserInfo(code) {
        if (!code) {
            throw Error("Invalid Credentials");
        }
        else {
            let { tokens } = await oauth2Client.getToken(decodeURIComponent(code));
            oauth2Client.setCredentials(tokens);
            const oauth = googleapis_1.google.oauth2({
                auth: oauth2Client,
                version: 'v2'
            });
            const user = await oauth.userinfo.get();
            const { data } = user;
            return data;
        }
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GoogleAuthResolver.prototype, "getGoogleAuthURL", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.GauthUserinfo),
    __param(0, (0, type_graphql_1.Arg)("code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GoogleAuthResolver.prototype, "getGoogleUserInfo", null);
GoogleAuthResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], GoogleAuthResolver);
exports.GoogleAuthResolver = GoogleAuthResolver;
//# sourceMappingURL=gauth.resolver.js.map