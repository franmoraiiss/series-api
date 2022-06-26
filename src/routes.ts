import { Router } from "express";

import { CreateSerieController } from "./controllers/CreateSerieController";
import { CreateTemporadaController } from "./controllers/CreateTemporadaController";
import { CreatePessoaController } from "./controllers/CreatePessoaController";
import { CreatePlataformaController } from "./controllers/CreatePlataformaController";
import { CreateGenerosController } from "./controllers/CreateGenerosController";
import { CreateTrailerController } from "./controllers/CreateTrailerController";
import { CreateElencoController } from "./controllers/CreateElencoController";
import { CreateCriadorController } from "./controllers/CreateCriadorController";
import { CreateEpisodioController } from "./controllers/CreateEpisodioController";
import { CreateGenerosSeriesControler } from "./controllers/CreateGenerosSeriesControler";

const router = Router();

const createSerie = new CreateSerieController();
const createTemporada = new CreateTemporadaController();
const createPessoa = new CreatePessoaController();
const createPlataforma = new CreatePlataformaController();
const createGenero = new CreateGenerosController();
const createTrailer = new CreateTrailerController();
const createElenco = new CreateElencoController();
const createCriador = new CreateCriadorController();
const createEpisodio = new CreateEpisodioController();
const createGeneroSerie = new CreateGenerosSeriesControler();


router.post("/series", createSerie.handle);
router.post("/temporada", createTemporada.handle);
router.post("/pessoa", createPessoa.handle);
router.post("/plataforma", createPlataforma.handle);
router.post("/genero", createGenero.handle);
router.post("/trailer", createTrailer.handle);
router.post("/elenco", createElenco.handle);
router.post("/criador", createCriador.handle);
router.post("/episodio", createEpisodio.handle);
router.post("/generoserie", createGeneroSerie.handle);

export { router };
