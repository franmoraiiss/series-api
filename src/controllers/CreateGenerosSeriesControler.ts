import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class CreateGenerosSeriesControler {
  async handle(request: Request, response: Response) {
    const { idGeneros, idSeries } = request.body;

    const generoSerie = await prismaClient.generos_Series.create({
      data: {
        generos_idGeneros: idGeneros,
        series_idSeries: idSeries,
      },
    });

    return response.json(generoSerie);
  }
}

