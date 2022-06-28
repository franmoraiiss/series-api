import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class CreatePlataformaController {
  async handle(request: Request, response: Response) {
    const { idPlataforma, nome } = request.body;

    const plataforma = await prismaClient.plataforma.create({
      data: {
        idPlataforma: idPlataforma,
        nome: nome,
      },
    });

    return response.json(plataforma);
  }
}
