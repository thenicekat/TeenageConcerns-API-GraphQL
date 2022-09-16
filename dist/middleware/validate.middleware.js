"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidated = void 0;
const isValidated = ({ args }, next) => {
    if (!args.email.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/)) {
        throw new Error("Invalid Email Format");
    }
    return next();
};
exports.isValidated = isValidated;
//# sourceMappingURL=validate.middleware.js.map