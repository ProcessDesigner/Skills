import { Router } from "express";
import { createTest, getTestByid, getTests, getTestsbyTeacheid } from "../Controller/test.controller.js";
import { isLoggedIn, isTeacher } from "../middleware/auth.middleware.js";

const router = Router()

router.post('/create',isLoggedIn,isTeacher,createTest)
router.get('/getTestsByTeacherid',isLoggedIn,isTeacher,getTestsbyTeacheid);
router.get('/getall',isLoggedIn,getTests)
router.get('/getTestbyId/:id',isLoggedIn,getTestByid)
export default router;