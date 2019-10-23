import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);

routes.put('/students/:id', StudentController.update);

routes.delete('/students/:id', StudentController.delete);

routes.get('/students', StudentController.show);

routes.get('/students/:id', StudentController.index);

export default routes;
