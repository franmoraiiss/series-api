import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class CreateElencoController {
  async handle(request: Request, response: Response) {
    const { idPessoa, idSeries, personagem } = request.body;

    const elenco = await prismaClient.elenco.create({
      data: {
        pessoa_id_pessoa: idPessoa,
        serie_id_serie: idSeries,
        personagem: personagem,
      },
    });

    return response.json(elenco);
  }
}
