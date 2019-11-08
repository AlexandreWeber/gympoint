import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import authMiddleware from './app/middlewares/auth';
import EnrolmentController from './app/controllers/EnrolmentController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);

routes.put('/students/:id', StudentController.update);

routes.delete('/students/:id', StudentController.delete);

routes.get('/students', StudentController.show);

routes.get('/students/:id', StudentController.index);

routes.post('/plans', PlanController.store);

routes.get('/plans', PlanController.show);

routes.put('/plans/:id', PlanController.update);

routes.delete('/plans/:id', PlanController.delete);

routes.post('/enrolments', EnrolmentController.store);

routes.get('/enrolments', EnrolmentController.show);

routes.put('/enrolments/:id', EnrolmentController.update);

routes.delete('/enrolments/:id', EnrolmentController.delete);

export default routes;
