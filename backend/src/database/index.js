import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import User from '../app/model/User';
import Student from '../app/model/Student';
import Plan from '../app/model/Plan';
import Enrolment from '../app/model/Enrolment';

const models = [User, Student, Plan, Enrolment];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
