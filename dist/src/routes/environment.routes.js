"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const environment_controller_1 = require("../controllers/environment.controller");
const router = (0, express_1.Router)();
router.get('/', environment_controller_1.EnvironmentController.getEnvironments);
router.post('/', environment_controller_1.EnvironmentController.createEnvironment);
router.patch('/:id', environment_controller_1.EnvironmentController.updateEnvironment);
exports.default = router;
