import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class CreateCriadorController {
  async handle(request: Request, response: Response) {
    const { idPessoa, idSeries } = request.body;

    const criador = await prismaClient.criador_Serie.create({
      data: {
        pessoa_idAtores: idPessoa,
        serie_idSeries: idSeries,
      },
    });

    return response.json(criador);
  }
}
