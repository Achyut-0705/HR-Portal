import { Router } from 'express';
import { signIn, singUp } from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/register', singUp);
authRouter.post('/login', signIn);

export default authRouter;
