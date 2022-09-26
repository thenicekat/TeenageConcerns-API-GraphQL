"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterAuthResolver = void 0;
const type_graphql_1 = require("type-graphql");
const twitter_api_sdk_1 = __importStar(require("twitter-api-sdk"));
const constants_1 = require("./../constants");
const authClient = new twitter_api_sdk_1.auth.OAuth2User({
    client_id: constants_1.TWITTER_CLIENT_ID,
    client_secret: constants_1.TWITTER_CLIENT_SECRET,
    callback: constants_1.TWITTER_REDIRECT_URL,
    scopes: ["tweet.read", "users.read", "offline.access"],
});
let TwitterAuthResolver = class TwitterAuthResolver {
    twitterAuthURL() {
        const authUrl = authClient.generateAuthURL({
            state: "state",
            code_challenge_method: "plain",
            code_challenge: "code_challenge"
        });
        return authUrl;
    }
    async twitterAuthRegister(code) {
        var _a;
        authClient.generateAuthURL({
            state: "state",
            code_challenge_method: "plain",
            code_challenge: "code_challenge"
        });
        const token = await authClient.requestAccessToken(code);
        const client = new twitter_api_sdk_1.default((_a = token.token) === null || _a === void 0 ? void 0 : _a.access_token);
        const data = await client.users.findMyUser({
            "tweet.fields": ["text"]
        });
        console.log(data);
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TwitterAuthResolver.prototype, "twitterAuthURL", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Number),
    __param(0, (0, type_graphql_1.Arg)("code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TwitterAuthResolver.prototype, "twitterAuthRegister", null);
TwitterAuthResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], TwitterAuthResolver);
exports.TwitterAuthResolver = TwitterAuthResolver;
//# sourceMappingURL=twitterAuth.resolver.js.map