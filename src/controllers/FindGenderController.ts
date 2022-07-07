import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class FindGenderController {
  async handle(request: Request, response: Response) {
    const { id, name, skip, take, orderBy } = request.body;

    const genders = await prismaClient.generos.findMany({
      take: take,
      skip: skip,
      where: {
        id_generos: id,
        nome: {
          contains: name,
        },
      },
      orderBy: {
        id_generos: orderBy || "asc",
      },
    });

    if (genders) {
      return response.status(200).json(genders);
    } else {
      return response.status(500);
    }
  }
}
