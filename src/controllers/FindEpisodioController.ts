import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class FindEpisodioController {
  async handle(request: Request, response: Response) {
    const { id, name, skip, take, orderBy, points, streaming } = request.body;

    const series = await prismaClient.episodio.findMany({
      take: take,
      skip: skip,
      where: {
        id_episodio: id,
        nome: name,
        nota: points,
        series: {
          plataforma_series: {
            every: {
              plataforma: {
                id_plataforma: streaming,
              },
            },
          },
        },
      },
      include: {
        series: {
          include: {
            plataforma_series: true,
          },
        },
      },
      orderBy: {
        id_episodio: orderBy || "asc",
      },
    });

    if (series) {
      return response.status(200).json(series);
    } else {
      return response.status(500);
    }
  }
}
