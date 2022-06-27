import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

//Cria a serie - Nao cadastra elenco e criador
export class CreateSerieController {
  async handle(request: Request, response: Response) {
    const { id, nome, notas, descricao, imagem, data_lancamento, pais_origem, em_producao } = request.body;

    const date = new Date(data_lancamento)
    const serie = await prismaClient.series.create({
      data: {
        idSeries: id,
        nome: nome,
        descricao: descricao,
        data_lancamento: date,
        nota: notas,
        imagem: imagem,
        pais_origem: pais_origem,
        em_producao: em_producao,
        criador: "default" //Deixei default pq criador vai ser na vdd uma tabela nova. então aqui nao vem nada, remover esse campo
      },
    });

    return response.json(serie);
  }
}
