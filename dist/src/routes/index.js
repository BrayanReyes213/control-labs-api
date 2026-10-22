"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loan_routes_1 = __importDefault(require("./loan.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const environment_routes_1 = __importDefault(require("./environment.routes"));
const equipment_routes_1 = __importDefault(require("./equipment.routes"));
const router = (0, express_1.Router)();
router.use('/loans', loan_routes_1.default);
router.use('/users', user_routes_1.default);
router.use('/environments', environment_routes_1.default);
router.use('/equipments', equipment_routes_1.default);
exports.default = router;
