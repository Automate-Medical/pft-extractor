"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretationGet = exports.ExtractGet = exports.ExtractIndex = exports.ExtractNew = void 0;
const ExtractNew_1 = __importDefault(require("./routes/ExtractNew"));
exports.ExtractNew = ExtractNew_1.default;
const ExtractIndex_1 = __importDefault(require("./routes/ExtractIndex"));
exports.ExtractIndex = ExtractIndex_1.default;
const ExtractGet_1 = __importDefault(require("./routes/ExtractGet"));
exports.ExtractGet = ExtractGet_1.default;
const InterpretationGet_1 = __importDefault(require("./routes/InterpretationGet"));
exports.InterpretationGet = InterpretationGet_1.default;
