import * as Yup from 'yup';
import Student from '../model/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: `Incorrect Data` });
    }

    const emailExists = req.body.email;
    const studentExists = await Student.findOne({
      where: { email: emailExists }
    });

    if (studentExists) {
      return res
        .status(400)
        .json({ error: 'There is already a student with the provided email' });
    }

    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height
    });
  }

  async update(req, res) {
    const { id } = req.params;
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: `Incorrect Data` });
    }

    const { email } = req.body;
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Invalid id, student does not exists' });
    }

    if (student.email !== email) {
      const emailExists = req.body.email;
      const studentExists = await Student.findOne({
        where: { email: emailExists }
      });

      if (studentExists) {
        return res
          .status(400)
          .json({ error: `Student ${emailExists} already exists` });
      }
    }

    const { name, age, weight, height } = await student.update(req.body);

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Invalid id, student does not exists' });
    }

    await Student.destroy({ where: { id } });

    return res.json({ message: 'Student successfully removed' });
  }

  async show({ res }) {
    const students = await Student.findAll();

    return res.json(students);
  }

  async index(req, res) {
    const { id } = req.params;
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ error: 'Student was not found' });
    }

    return res.json(student);
  }
}

export default new StudentController();
