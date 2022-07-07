import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class FindPeopleController {
  async handle(request: Request, response: Response) {
    const { id, name, skip, take, orderBy, points, } = request.body;

    const peoples = await prismaClient.episodio.findMany({
      take: take,
      skip: skip,
      where: {
        id_episodio: id,
        nome: {
          contains: name,
        },
        nota: points,
        series:
      },
      orderBy: {
        id_episodio: orderBy || "asc",
      },
    });

    if (peoples) {
      return response.status(200).json(peoples);
    } else {
      return response.status(500);
    }
  }
}
