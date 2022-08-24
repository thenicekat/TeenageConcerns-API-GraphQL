"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthMentor = exports.isAuthUser = void 0;
const isAuthUser = ({ context }, next) => {
    if (!context.req.session.userId || context.req.session.isMentor) {
        throw Error("Not an Authenticated User");
    }
    return next();
};
exports.isAuthUser = isAuthUser;
const isAuthMentor = ({ context }, next) => {
    if (context.req.session.userId || !context.req.session.isMentor) {
        throw Error("Not an Authenticated Mentor");
    }
    return next();
};
exports.isAuthMentor = isAuthMentor;
//# sourceMappingURL=auth.middleware.js.map