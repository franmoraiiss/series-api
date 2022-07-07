import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class FindPeopleController {
  async handle(request: Request, response: Response) {
    const { id, name, skip, take, orderBy, gender } = request.body;

    const peoples = await prismaClient.pessoa.findMany({
      take: take,
      skip: skip,
      where: {
        id_pessoa: id,
        nome: {
          contains: name,
        },
        genero: gender,
      },
      orderBy: {
        id_pessoa: orderBy || "asc",
      },
    });

    if (peoples) {
      return response.status(200).json(peoples);
    } else {
      return response.status(500);
    }
  }
}
