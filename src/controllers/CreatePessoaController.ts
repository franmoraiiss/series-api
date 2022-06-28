import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class CreatePessoaController {
  async handle(request: Request, response: Response) {
    const { idPessoa, nome, foto, biografia, genero, data_nascimento, data_morte, lugar_nascimento, popularidade } = request.body;

    const pessoa = await prismaClient.pessoa.create({
      data: {
        idPessoa: idPessoa,
        nome: nome,
        foto: foto,
        biografia: biografia,
        genero: genero,
        data_nascimento: data_nascimento,
        data_morte: data_morte,
        lugar_nascimento: lugar_nascimento,
        popularidade: popularidade,
      },

    });

    return response.json(pessoa)
  }



}