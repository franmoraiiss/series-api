import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

//Cria a serie - Nao cadastra elenco e criador
export class CreateSerieController {
  async handle(request: Request, response: Response) {
    const { id, nome, notas, descricao, imagem, data_lancamento, pais_origem, em_producao } = request.body;

    const serie = await prismaClient.series.create({
      data: {
        idSeries: id,
        nome: nome,
        descricao: descricao,
        data_lancamento: data_lancamento,
        nota: notas,
        imagem: imagem,
        pais_origem: pais_origem,
        em_producao: em_producao,
      },
    });

    return response.json(serie);
  }
}
