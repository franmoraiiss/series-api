import axios from 'axios';
import { api_key } from '../config/api_key';
import { Request, Response } from "express";

const idPessoasCadastras: number[] = []
const idProdCadastras = []

export class GetSeriesTmdb {
  async handle(request: Request, response: Response) {
    const { } = request.body;

    //Buscando a serie
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/tv/2?api_key=${api_key}&language=en-US`)

      //Cria um objeto com todos os dados necessarios para criar a serie.
      const novaSerie = {
        idSerie: response.data.id,
        nome: response.data.name,
        nota: response.data.vote_average,
        descricao: response.data.overview,
        poster: response.data.poster_path,
        data_lancamento: response.data.first_air_date,
        criador: "default",
        pais_origem: response.data.origin_country[0],
        em_producao: response.data.in_production,
      }

      const criadoresSerie = response.data.created_by;

      for (const criador in criadoresSerie) {
        //Pegar os id dos criadores, ver se ja tem cadastrado, se não tiver realizar a consulta e salvar o registro.

      }
      // console.log(criadoresSerie[0]);
    } catch (error) {
      console.log(error);
    }

    //Função que busca no array se ja tem cadastro da pessoa, se nao tiver cadastra antes de associar.
    async function CreatePeople(id: number, idPessoasCadastras: number[]) {
      if (id in idPessoasCadastras) { //tem cadastro
        console.log(id);
        //Chama CreateCriadorController ou a funçao dela.
      }
      else { //Nao tem cadastro
        const idCriador = id; //salva id
        const criadores = await axios.get(`https://api.themoviedb.org/3/person/${idCriador}?api_key=${api_key}`) //busca pessoa

        //Cadastra pessoa
        console.log(criadores)
      }
    };


  }

};




