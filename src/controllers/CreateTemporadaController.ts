import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class CreateTemporadaController {
  async handle(request: Request, response: Response) {
    const { idTemporada, nome, descricao, link_foto, quantidade_ep, numero_temporarada, series_idSeries } = request.body;

    const temporada = await prismaClient.temporadas.create({
      data: {
        idTemporadas: idTemporada,
        nome: nome,
        descricao: descricao,
        link_foto: link_foto,
        quantidade_ep: quantidade_ep,
        numero_temporarada: numero_temporarada,
        series_idSeries: series_idSeries
        //Criador e elenco serão tabelas de relação de series com pessoas
        //criador: 
      },
    });

    return response.json(temporada);
  }
}
