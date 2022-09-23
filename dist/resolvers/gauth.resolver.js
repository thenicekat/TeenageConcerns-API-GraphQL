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
exports.GoogleAuthResolver = void 0;
const googleapis_1 = require("googleapis");
const types_1 = require("../types");
const type_graphql_1 = require("type-graphql");
const constants_1 = require("./../constants");
const Mentor_1 = require("./../entity/Mentor");
const argon2_1 = __importDefault(require("argon2"));
const oauth2Client = new googleapis_1.google.auth.OAuth2(constants_1.GAUTH_CLIENT_ID, constants_1.GAUTH_CLIENT_SECRET, constants_1.GAUTH_REDIRECT_URL);
let GoogleAuthResolver = class GoogleAuthResolver {
    googleAuthURL() {
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
    async googleUserRegister({ db }, code, password) {
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
            const mentor = await db.manager.findOne(Mentor_1.Mentor, {
                where: {
                    email: data.email
                }
            });
            if (!mentor) {
                const hash = await argon2_1.default.hash(password);
                const mentor = db.manager.create(Mentor_1.Mentor, {
                    name: data.name,
                    email: data.email,
                    password: hash,
                    users: []
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
                return {
                    userInfo: mentor
                };
            }
        }
        return {
            errors: [
                {
                    field: "Mentor",
                    message: "Some error occured"
                }
            ]
        };
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GoogleAuthResolver.prototype, "googleAuthURL", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.GauthUserReturn),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("code")),
    __param(2, (0, type_graphql_1.Arg)("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], GoogleAuthResolver.prototype, "googleUserRegister", null);
GoogleAuthResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], GoogleAuthResolver);
exports.GoogleAuthResolver = GoogleAuthResolver;
//# sourceMappingURL=gauth.resolver.js.map