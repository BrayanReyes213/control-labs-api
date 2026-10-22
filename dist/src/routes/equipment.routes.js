"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const equipment_controller_1 = require("../controllers/equipment.controller");
const router = (0, express_1.Router)();
router.get('/search', equipment_controller_1.EquipmentController.getEquipmentsByFilter);
router.post('/', equipment_controller_1.EquipmentController.createEquipment);
router.patch('/:id', equipment_controller_1.EquipmentController.updateEquipment);
exports.default = router;
