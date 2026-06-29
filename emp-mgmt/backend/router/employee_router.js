import express from 'express';

import * as Controller from '../controller/employee_controller.js';
import { verifyToken } from '../controller/employee_controller.js';

const Router = express.Router();

// auth routes
Router.post('/register', Controller.register);
Router.post('/login', Controller.login);

// employee routes
Router.post('/save', verifyToken, Controller.save);
Router.get('/fetch', verifyToken, Controller.fetch);
Router.get('/fetch/:_id', verifyToken, Controller.fetchOne);
Router.patch('/update', verifyToken, Controller.update);
Router.delete('/delete', verifyToken, Controller.deleteEmployee);

export default Router;
