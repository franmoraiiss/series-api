import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class CreateGenerosController {
  async handle(request: Request, response: Response) {
    const { idGeneros, nome } = request.body;

    const genero = await prismaClient.generos.create({
      data: {
        idGeneros: idGeneros,
        nome: nome,
      },
    });

    return response.json(genero);
  }
}
