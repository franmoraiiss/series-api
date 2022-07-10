import { Router } from "express";
import { GetSeriesTmdb } from "./bussinees/requestTMDB";
import { FindEpisodioController } from "./controllers/FindEpisodioController";
import { FindSeriesController } from "./controllers/FindSeriesController";
import { FindPeopleController } from "./controllers/FindPeopleController";

const router = Router();

// Controllers
const getSeriesTmdb = new GetSeriesTmdb();
const getSeries = new FindSeriesController();
const getPeople = new FindPeopleController();
const getEpisodio = new FindEpisodioController();

router.get("/series", getSeries.handle);
router.get("/pessoas", getPeople.handle);
router.get("/episodios", getEpisodio.handle);

router.get("/seriestmdb", getSeriesTmdb.handle);

export { router };
