import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class FindSeriesController {
  async handle(request: Request, response: Response) {
    const {
      id,
      name,
      skip,
      take,
      orderBy,
      character,
      actor,
      rating,
      release_date,
      country,
      id_creator,
      name_creator,
      number_season,
      in_production,
    } = request.body;

    const series = await prismaClient.series.findMany({
      take: take,
      skip: skip,
      where: {
        id_series: id,
        nome: name,
        elenco: {
          some: {
            personagem: character,
            pessoa: {
              nome: actor,
            },
          },
        },
        nota: rating,
        data_lancamento: {
          equals: release_date
            ? new Date(release_date).toISOString()
            : undefined,
        },
        pais_origem: country,
        criador_serie: {
          some: {
            pessoa: {
              id_pessoa: id_creator,
              nome: name_creator,
            },
          },
        },
        temporadas: {
          every: {
            numero_temporarada: {
              equals: number_season,
            },
          },
        },
        em_producao: {
          equals: in_production,
        },
      },
      orderBy: {
        nome: orderBy || "asc",
      },
      include: {
        temporadas: true,
      },
    });

    if (series) {
      return response.status(200).json(series);
    } else {
      return response.status(500);
    }
  }
}
