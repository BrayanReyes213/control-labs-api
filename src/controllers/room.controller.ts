import { Request, Response } from 'express';

export class RoomController {
  public static getRooms = (req: Request, res: Response): void => {
    // TODO: llamar al servicio y responder con el listado completo de ambientes.
    res.status(501).json({
      success: false,
      message: 'El listado de ambientes todavía no está implementado.'
    });
  };

  public static createRoom = (req: Request, res: Response): void => {
    // TODO: llamar al servicio con req.body y responder 201 con el ambiente creado.
    res.status(501).json({
      success: false,
      message: 'El registro de ambientes todavía no está implementado.'
    });
  };

  public static updateRoom = (req: Request, res: Response): void => {
    const { id } = req.params;
    // TODO: pasar id y req.body a la operación de actualización parcial (capacidad o estado operativo).
    res.status(501).json({
      success: false,
      message: `La actualización del ambiente ${id} todavía no está implementada.`
    });
  };
}
