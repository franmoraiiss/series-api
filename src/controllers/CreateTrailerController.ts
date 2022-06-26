import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class CreateTrailerController {
  async handle(request: Request, response: Response) {
    const { idTrailer, nome, key, tipo, idSeries, website } = request.body;

    const trailer = await prismaClient.trailer.create({
      data: {
        idTrailer: idTrailer,
        nome: nome,
        key_trailer: key,
        tipo: tipo,
        series_idSeries: idSeries,
        website_plataform: website,
      },
    });

    return response.json(trailer);
  }
}
