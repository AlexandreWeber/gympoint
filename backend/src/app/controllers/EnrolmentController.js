import { parseISO, isBefore } from 'date-fns';
import Enrolment from '../model/Enrolment';
import Student from '../model/Student';
import Plan from '../model/Plan';
import Queue from '../../lib/Queue';
import EnrolmentMail from '../jobs/EnrolmentMail';

class EnrolmentController {
  async store(req, res) {
    const { start_date, student: student_id, plan: plan_id } = req.body;

    // Verify if the student exists
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student provided was not found' });
    }

    // Verify if the plan exists
    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan provided was not found' });
    }

    let enrolment = await Enrolment.create({
      student_id,
      plan_id,
      start_date
    });

    enrolment = await Enrolment.findByPk(enrolment.id, {
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title']
        }
      ]
    });

    await Queue.add(EnrolmentMail.key, { enrolment });

    return res.json(enrolment);
  }

  async show(req, res) {
    const { page = 1 } = req.query;

    const enrolments = await Enrolment.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name']
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title']
        }
      ],
      limit: 20,
      offset: (page - 1) * 20
    });

    res.json(enrolments);
  }

  async update(req, res) {
    const { id } = req.params;
    const { start_date, plan: plan_id } = req.body;

    // Verify if enrolment is valid
    const enrolment = await Enrolment.findByPk(id);
    if (!enrolment) {
      return res.status(400).json({ error: 'The enrolment was not foubd' });
    }

    // Verify if the new start_date is before than today
    if (isBefore(parseISO(start_date), new Date())) {
      return res
        .status(400)
        .json({ error: 'The initial date must be greater than today' });
    }

    const plan = await Plan.findByPk(enrolment.plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan provided was not found' });
    }

    await enrolment.update({
      start_date,
      plan_id
    });

    return res.json(enrolment);
  }

  async delete(req, res) {
    const { id } = req.params;

    const enrolment = await Enrolment.findByPk(id);

    if (!enrolment) {
      return res.status(400).json({ error: 'Enrolment was not found' });
    }

    await Enrolment.destroy({ where: { id } });

    return res.json({ message: 'Enrolment successfully removed' });
  }
}

export default new EnrolmentController();
