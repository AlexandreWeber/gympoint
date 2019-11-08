import { Model, Sequelize } from 'sequelize';
import { addMonths } from 'date-fns';
import Plan from './Plan';

class Enrolment extends Model {
  static init(sequelize) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.DECIMAL
      },
      {
        sequelize
      }
    );

    this.addHook('beforeSave', async enrolment => {
      const plan = await Plan.findByPk(enrolment.plan_id);

      enrolment.end_date = addMonths(enrolment.start_date, plan.duration);
      enrolment.price = plan.duration * plan.price;
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
    this.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'plan' });
  }
}

export default Enrolment;
