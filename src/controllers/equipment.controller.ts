import { Request, Response } from 'express';

export class EquipmentController {
  public static getEquipmentsByFilter = (req: Request, res: Response): void => {
    // TODO: tomar los filtros de req.query (ej. ambiente), llamar al servicio y responder con los resultados.
    res.status(501).json({
      success: false,
      message: 'La consulta de equipos todavía no está implementada.'
    });
  };

  public static createEquipment = (req: Request, res: Response): void => {
    // TODO: llamar al servicio con req.body y responder 201 con el equipo creado.
    res.status(501).json({
      success: false,
      message: 'El registro de equipos todavía no está implementado.'
    });
  };

  public static updateEquipment = (req: Request, res: Response): void => {
    const { id } = req.params;
    // TODO: pasar id y req.body a la operación de actualización parcial (estado técnico o ubicación).
    res.status(501).json({
      success: false,
      message: `La actualización del equipo ${id} todavía no está implementada.`
    });
  };
}
