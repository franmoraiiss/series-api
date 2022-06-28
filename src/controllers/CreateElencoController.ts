import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class CreateElencoController {
  async handle(request: Request, response: Response) {
    const { idPessoa, idSeries, personagem } = request.body;

    const elenco = await prismaClient.elenco.create({
      data: {
        pessoa_idPessoa: idPessoa,
        serie_idSerie: idSeries,
        personagem: personagem,
      },
    });

    return response.json(elenco);
  }
}
