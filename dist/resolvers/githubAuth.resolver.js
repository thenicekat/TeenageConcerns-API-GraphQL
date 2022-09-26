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
exports.GithubAuthResolver = void 0;
const axios_1 = __importDefault(require("axios"));
const argon2_1 = __importDefault(require("argon2"));
const types_1 = require("src/types");
const type_graphql_1 = require("type-graphql");
const constants_1 = require("./../constants");
const Mentor_1 = require("src/entity/Mentor");
let GithubAuthResolver = class GithubAuthResolver {
    githubAuthURL() {
        return "https://github.com/login/oauth/authorize?scope=user:email&client_id=" + constants_1.GITHUB_CLIENT_ID;
    }
    async githubAuthRegister(code, password, { db }) {
        axios_1.default.post('https://github.com/login/oauth/access_token', {
            client_id: constants_1.GITHUB_CLIENT_ID,
            code: code,
            redirect_url: constants_1.GITHUB_REDIRECT_URL,
            client_secret: constants_1.GITHUB_CLIENT_SECRET
        }, {
            headers: {
                "Accept": "application/json"
            }
        })
            .then(res => {
            axios_1.default.get('https://api.github.com/user', {
                headers: {
                    "Authorization": "Bearer " + res.data.access_token
                }
            })
                .then(async (resp) => {
                const mentor = await db.manager.findOne(Mentor_1.Mentor, {
                    where: {
                        email: resp.data.email
                    }
                });
                if (!mentor) {
                    const hash = await argon2_1.default.hash(password);
                    const mentor = db.manager.create(Mentor_1.Mentor, {
                        name: resp.data.login,
                        email: resp.data.email,
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
                return {
                    errors: [{
                            field: "Github Registration",
                            message: "Error using github auth"
                        }]
                };
            })
                .catch(err => console.log(err));
        })
            .catch(err => console.log(err));
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GithubAuthResolver.prototype, "githubAuthURL", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.MentorReturn),
    __param(0, (0, type_graphql_1.Arg)("code")),
    __param(1, (0, type_graphql_1.Arg)("password")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], GithubAuthResolver.prototype, "githubAuthRegister", null);
GithubAuthResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], GithubAuthResolver);
exports.GithubAuthResolver = GithubAuthResolver;
//# sourceMappingURL=githubAuth.resolver.js.map