import axios from 'axios';
import { api_key } from '../config/api_key';
import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

const idPessoasCadastras: number[] = []



//Função para gerar a relação de criador e serie
async function createRelationCriador(idPerson: number, idSerie: number) {
  try {

    const criadorSerie = await prismaClient.criador_Serie.create({
      data: {
        pessoa_idAtores: idPerson,
        serie_idSeries: idSerie,
      },
    });
  } catch (err) {

  }

}


//Função que busca no array se ja tem cadastro da pessoa, se nao tiver cadastra antes de associar.
async function createPeople(id: number, idPessoasCadastras: number[]) {
  if (id in idPessoasCadastras) { //tem cadastro
    console.log(id);
    console.log("Já cadastrado");
    //Criar a relação de pessoa e serie como criador dela.
  }
  else { //Nao tem cadastro
    const idPessoa = id; //salva id
    const person = await axios.get(`https://api.themoviedb.org/3/person/${idPessoa}?api_key=${api_key}`) //busca pessoa

    //Cria no banco a pessoa.
    try {
      // console.log(criadores.data)
      const pessoa = await prismaClient.pessoa.create({
        data: {
          idPessoa: person.data.id,
          nome: person.data.name,
          foto: person.data.profile_path,
          biografia: person.data.biography,
          genero: person.data.gender,
          data_nascimento: new Date(person.data.birthday),
          data_morte: new Date(person.data.deathday),
          lugar_nascimento: person.data.place_of_birth,
          popularidade: person.data.popularity,
        },
      });
      //Adiciona o id no array pra mostrar que ja foi cadastrado
      idPessoasCadastras.push(person.data.id)

    }
    catch (error) {
      console.log(error);
    }
  }
};

//Buscar a serie pelo ID. 
async function getSerieById(id: number) {
  const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${api_key}`);

  //Criar a serie passando os dados dela
  try {
    const serie = await prismaClient.series.create({
      data: {
        idSeries: id,
        nome: response.data.name,
        nota: response.data.vote_average,
        descricao: response.data.overview,
        imagem: response.data.poster_path,
        data_lancamento: new Date(response.data.first_air_date),
        criador: "default",
        pais_origem: response.data.origin_country[0],
        em_producao: response.data.in_production,
      }
    });
  }
  catch (error) {
    console.log(error);
  }

  //Receber o array de criadores, pegando os id e verificando se ja tem cadastro.
  for (const criador in response.data.created_by) {
    const idCriador = response.data.created_by[criador].id
    createPeople(idCriador, idPessoasCadastras); // console.log(idCriador, idPessoasCadastras);
    createRelationCriador(idCriador, response.data.id)
  }

  //Adicionar TemporadasSerie




  console.log("Criado com sucesso")

}

//Classe que vai chamar as series populares e depois chamar as funçoes para cadastrar todos os dados.
export class GetSeriesTmdb {
  async handle(request: Request, response: Response) {
    const { } = request.body;

    try {
      //Definir quantas paginas de series buscaremos
      const maxPage = 1; //Total é 67195
      let page: number;
      //Loop olhando cada pagina de busca
      for (page = 1; page <= maxPage; page++) {
        //Buscar as series mais populares
        const response = await axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${api_key}&page=${page}`)
        // console.log(response.data.results)
        const arraySeries = response.data.results;

        //Agora vai ver cada serie do retorno e chamar a função para cadastrar.
        for (const series in arraySeries) {
          getSerieById(arraySeries[series].id);
        }
      }


      // const criadoresSerie = response.data.created_by;

      // for (const criador in criadoresSerie) {
      //   //Pegar os id dos criadores, ver se ja tem cadastrado, se não tiver realizar a consulta e salvar o registro.
      //   createPeople(criadoresSerie[criador].id, idPessoasCadastras)
      // }
      // console.log(criadoresSerie[0]);
    } catch (error) {
      console.log(error);
    }
  }
};

//Primeiro acessar a api e buscar as series mais populares.
//Irá retornar varias páginas, iterar sobre cada serie pegando o ID da mesma

//Chamar a função de cadastrar serie



