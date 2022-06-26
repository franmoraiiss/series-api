import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class CreateEpisodioController {
  async handle(request: Request, response: Response) {
    const { idEpisodio, nome, descricao, nota, data_estreia, idSeries, idTemporadas, } = request.body;

    const episodio = await prismaClient.episodio.create({
      data: {
        idEpisodio: idEpisodio,
        nome: nome,
        descricao: descricao,
        data_estreia: data_estreia,
        nota: nota,
        temporadas_idSeries: idSeries,
        temporadas_idTemporadas: idTemporadas,
      },
    });

    return response.json(episodio);
  }
}
