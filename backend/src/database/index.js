import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/model/User';

import Student from '../app/model/Student';

import Plan from '../app/model/Plan';

const models = [User, Student, Plan];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
