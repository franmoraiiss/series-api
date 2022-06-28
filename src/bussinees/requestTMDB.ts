import axios from 'axios';
import { api_key } from '../config/api_key';
import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

const idPessoasCadastras: number[] = []

//Função para gerar a relação de criador e serie
async function createRelationCriador(idPerson: number, idSerie: number) {
  try {

    await prismaClient.criador_Serie.create({
      data: {
        pessoa_idAtores: idPerson,
        serie_idSeries: idSerie,
      },
    });
  } catch (error) {
    // console.log(error)
  }

}

//Função que busca no array se ja tem cadastro da pessoa, se nao tiver cadastra antes de associar.
async function createPeople(id: number, idPessoasCadastras: number[]) {
  if (id in idPessoasCadastras) { //tem cadastro
    console.log(id);
    console.log("Pessoa Já cadastrada");
    //Criar a relação de pessoa e serie como criador dela.
  }
  else { //Nao tem cadastro

    //Cria no banco a pessoa.
    try {
      // const idPessoa = id; //salva id
      const person = await axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=${api_key}`) //busca pessoa

      // console.log(criadores.data)
      await prismaClient.pessoa.create({
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
      // console.log("Falha ao criar pessoa");
    }
  }
};

//Criar elenco
async function createElenco(idPessoa: number, idSerie: number, character: string) {
  try {

    await prismaClient.elenco.create({
      data: {
        pessoa_idPessoa: idPessoa,
        serie_idSerie: idSerie,
        personagem: character,
      },
    });
  }
  catch (error) {
    console.log(error)
  }


}

async function createEpisode(episodeNumber: number, idSerie: number, season_number: number, idSeason: number) {

  try {

    const episode = await axios.get(`https://api.themoviedb.org/3/tv/${idSerie}/season/${season_number}/episode/${episodeNumber}?api_key=${api_key}`)

    await prismaClient.episodio.create({
      data: {
        idEpisodio: episode.data.id,
        numeroEpisodio: episode.data.episode_number,
        nome: episode.data.name,
        descricao: episode.data.overview,
        data_estreia: new Date(episode.data.air_date),
        nota: episode.data.vote_average,
        temporadas_idSeries: idSerie,
        temporadas_idTemporadas: idSeason,
      },
    });
  }
  catch (error) {
    console.log(error)
  }
}

async function createSeason(season_number: number, idSerie: number, totalEp: number) {
  try {
    const seasons = await axios.get(`https://api.themoviedb.org/3/tv/${idSerie}/season/${season_number}?api_key=${api_key}`)

    // Cria a temporada
    await prismaClient.temporadas.create({
      data: {
        idTemporadas: seasons.data.id,
        nome: seasons.data.name,
        descricao: seasons.data.overview,
        link_foto: seasons.data.poster_path,
        quantidade_ep: totalEp,
        numero_temporarada: season_number,
        series_idSeries: idSerie
      },
    });

    //Cadastrando estrelas da serie. Busca cada id e manda criar
    for (const episode in seasons.data.episodes) {
      // createEpisode(seasons.data.episodes[episode].episode_number, idSerie, season_number, seasons.data.id);

      // const stars = seasons.data.episodes[episode].guest_stars;
      // for (const star in stars) {
      //   const idStar = stars[star].id
      //   await createPeople(idStar, idPessoasCadastras);
      //   createElenco(idStar, idSerie, stars[star].character)
      //   // console.log(idStar, idSerie, stars[star].character);
      //   // console.log(stars[star].id);
      // }

    }


  }
  catch (error) {
    // console.log("falha ao criar temporada");
  }
}

async function createPlataforma(idPlataforma: number, nomePlataforma: string) {
  try {

    await prismaClient.plataforma.create({
      data: {
        idPlataforma: idPlataforma,
        nome: nomePlataforma,
      },
    });
  }
  catch (error) {
    console.log(error);
  }

}

//Criar Relação de plataforma e series tabela n existe
async function createRelationPlataformaSerie(idPlataforma: number, idSeason: number) {
  try {

    await prismaClient.plataforma_series.create({
      data: {
        series_idSeries: idSeason,
        plataforma_idPlataforma: idPlataforma,
      },
    });
  } catch (error) {
    // console.log(error)
  }
}

//Buscar a serie pelo ID. 
async function getSerieById(idSeason: number) {
  const response = await axios.get(`https://api.themoviedb.org/3/tv/${idSeason}?api_key=${api_key}`);

  //Criar a serie passando os dados dela
  try {
    await prismaClient.series.create({
      data: {
        idSeries: idSeason,
        nome: response.data.name,
        nota: response.data.vote_average,
        descricao: response.data.overview,
        imagem: response.data.poster_path,
        data_lancamento: new Date(response.data.first_air_date),
        pais_origem: response.data.origin_country[0],
        em_producao: response.data.in_production,
      }
    });
  }
  catch (error) {
    // console.log(error);
    // console.log("erro ao pegar serie");
  }

  //Receber o array de criadores, pegando os id e verificando se ja tem cadastro.
  // for (const criador in response.data.created_by) {
  //   const idCriador = response.data.created_by[criador].id
  //   createPeople(idCriador, idPessoasCadastras); // console.log(idCriador, idPessoasCadastras);
  //   createRelationCriador(idCriador, response.data.id)
  // }

  // //Adicionar TemporadasSerie
  // for (const season in response.data.seasons) {
  //   const idSeason = response.data.seasons[season].id
  //   createSeason(response.data.seasons[season].season_number, response.data.id, response.data.seasons[season].episode_count)
  // }

  // console.log("Criado com sucesso")
  // console.log(response.data.networks)
  for (const network in response.data.networks) {
    await createPlataforma(response.data.networks[network].id, response.data.networks[network].name);
    createRelationPlataformaSerie(response.data.networks[network].id, idSeason);

  }
}

//Classe que vai chamar as series populares e depois chamar as funçoes para cadastrar todos os dados.
export class GetSeriesTmdb {
  async handle(request: Request, response: Response) {
    const { } = request.body;

    try {
      //Definir quantas paginas de series buscaremos
      const maxPage = 1; //Total é 67195 sendo 20 series por pagina
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
        // }


        // const criadoresSerie = response.data.created_by;

        // // for (const criador in criadoresSerie) {
        // //   //Pegar os id dos criadores, ver se ja tem cadastrado, se não tiver realizar a consulta e salvar o registro.
        // //   createPeople(criadoresSerie[criador].id, idPessoasCadastras)
        // // }
        // // console.log(criadoresSerie[0]);

        //Chamar o cadastro das 
      }
    } catch (error) {
      // console.log(error);
    }
  }
};

//Primeiro acessar a api e buscar as series mais populares.
//Irá retornar varias páginas, iterar sobre cada serie pegando o ID da mesma

//Chamar a função de cadastrar serie