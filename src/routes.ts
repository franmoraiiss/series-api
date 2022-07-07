import { Router } from "express";
import { GetSeriesTmdb } from "./bussinees/requestTMDB";
import { FindGenderController } from "./controllers/FindGenderController";
import { FindPeopleController } from "./controllers/FindPeopleController";

const router = Router();

// Controllers
const getSeriesTmdb = new GetSeriesTmdb();
const getGender = new FindGenderController();
const getPeople = new FindPeopleController();

router.get("/generos", getGender.handle);
router.get("/pessoas", getPeople.handle);

router.get("/seriestmdb", getSeriesTmdb.handle);

export { router };
