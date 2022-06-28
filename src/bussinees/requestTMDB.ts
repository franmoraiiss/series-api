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
      createEpisode(seasons.data.episodes[episode].episode_number, idSerie, season_number, seasons.data.id);

      const stars = seasons.data.episodes[episode].guest_stars;
      for (const star in stars) {
        const idStar = stars[star].id
        await createPeople(idStar, idPessoasCadastras);
        createElenco(idStar, idSerie, stars[star].character)
      }

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
    // console.log(error);
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

//Função para associar genero e serie
async function createRelationGenreSerie(idGenre: number, idSerie: number) {

  try {
    await prismaClient.generos_Series.create({
      data: {
        generos_idGeneros: idGenre,
        series_idSeries: idSerie,
      },
    });

  }
  catch (error) {
    // console.log(error)
  }
}

//Buscar a serie pelo ID. 
async function getSerieById(idSerie: number) {
  const response = await axios.get(`https://api.themoviedb.org/3/tv/${idSerie}?api_key=${api_key}`);

  //Criar a serie passando os dados dela
  try {
    await prismaClient.series.create({
      data: {
        idSeries: idSerie,
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

  // Receber o array de criadores, pegando os id e chamando as funções para adicionar pessoa e criar relação de criador
  for (const criador in response.data.created_by) {
    const idCriador = response.data.created_by[criador].id
    await createPeople(idCriador, idPessoasCadastras); // console.log(idCriador, idPessoasCadastras);
    await createRelationCriador(idCriador, response.data.id)
  }

  //Adicionar TemporadasSerie
  for (const season in response.data.seasons) {
    const idSeason = response.data.seasons[season].id
    createSeason(response.data.seasons[season].season_number, response.data.id, response.data.seasons[season].episode_count)
  }

  for (const genre in response.data.genres) {
    const idGenre = response.data.genres[genre].id
    createRelationGenreSerie(idGenre, idSerie)
  }

  // console.log("Criado com sucesso")
  // console.log(response.data.networks)
  for (const network in response.data.networks) {
    await createPlataforma(response.data.networks[network].id, response.data.networks[network].name);
    createRelationPlataformaSerie(response.data.networks[network].id, idSerie);

  }
}

//Buscar Generos de series 
async function getGeneros() {
  try {
    //Busca todos os generos
    const generos = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`)

    const geneross = generos.data.genres;


    //Para cada genero cadastra com seu id e nome
    for (const genero in generos.data.genres) {

      // console.log(String(generos.data.genres));
      await prismaClient.generos.create({
        data: {
          idGeneros: generos.data.genres[genero].id,
          nome: generos.data.genres[genero].name,
        }
      });
    }

  }
  catch (error) {
    console.log(error)
  }
}


async function getTrailers(idSerie: number) {
  try {
    const videos = await axios.get(`https://api.themoviedb.org/3/tv/${idSerie}/videos?api_key=${api_key}`)

    const videosRecebidos = videos.data.results
    for (const video in videosRecebidos) {
      if (videosRecebidos[video].type == "Trailer") {
        await prismaClient.trailer.create({
          data: {
            idTrailer: videosRecebidos[video].id,
            nome: videosRecebidos[video].nome,
            key_trailer: videosRecebidos[video].key,
            tipo: videosRecebidos[video].type,
            series_idSeries: idSerie,
            website_plataform: videosRecebidos[video].site,
          },
        });
      }
    }

  } catch (error) {
    console.log(error)
  }

}


//Classe que vai chamar as series populares e depois chamar as funçoes para cadastrar todos os dados.
export class GetSeriesTmdb {
  async handle(request: Request, response: Response) {
    const { } = request.body;

    //Carrega todos os generos na tabela de generos
    getGeneros();

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

        //Agora vai ver cada serie do retorno e chamar a função para cadastrar a serie e trailers.
        for (const series in arraySeries) {
          await getSerieById(arraySeries[series].id);
          await getTrailers(arraySeries[series].id);
        }

      }
    } catch (error) {
      // console.log(error);
    }
  }
};
