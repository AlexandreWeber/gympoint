import * as Yup from 'yup';
import Plan from '../model/Plan';

class PlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: `Incorrect data` });
    }

    const planExists = await Plan.findOne({ where: { title: req.body.title } });
    if (planExists) {
      return res
        .status(400)
        .json({ error: 'There is already a plan with the provided name' });
    }

    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price
    });
  }

  async show({ res }) {
    const plans = await Plan.findAll();

    return res.json(plans);
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: `Incorrect data` });
    }

    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(400).json({ error: 'Invalid Id, plan does not exists' });
    }

    const { title } = req.body;

    if (title !== plan.title) {
      const planExists = await Plan.findOne({
        where: { title: req.body.title }
      });

      if (planExists) {
        return res
          .status(400)
          .json({ error: 'There is already a plan with the provided name' });
      }
    }

    const { duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(400).json({ error: 'Invalid Id, plan does not exists' });
    }

    await Plan.destroy({ where: { id } });

    return res.json({ message: 'Plan removed successfully' });
  }
}

export default new PlanController();
