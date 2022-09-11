"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__local__ = exports.__test__ = exports.__prod__ = exports.COOKIE_KEY = exports.PORT = void 0;
exports.PORT = (process.env.PORT_NO && parseInt(process.env.PORT_NO)) || 5000;
exports.COOKIE_KEY = "cookey";
exports.__prod__ = process.env.NODE_ENV === 'production';
exports.__test__ = process.env.NODE_ENV === 'test';
exports.__local__ = true;
//# sourceMappingURL=constants.js.map