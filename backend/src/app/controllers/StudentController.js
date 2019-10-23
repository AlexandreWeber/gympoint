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
      return res.status(400).json({ error: `Dados incorretos` });
    }

    const emailExists = req.body.email;
    const studentExists = await Student.findOne({
      where: { email: emailExists }
    });

    if (studentExists) {
      return res
        .status(400)
        .json({ error: 'Já existe um aluno com o email informado' });
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
      return res.status(400).json({ error: `Dados incorretos` });
    }

    const { email } = req.body;
    const student = await Student.findByPk(id);

    if (!student) {
      return res
        .status(400)
        .json({ error: 'Id inválido, aluno não existe' });
    }

    if (student.email !== email) {
      const emailExists = req.body.email;
      const studentExists = await Student.findOne({
        where: { email: emailExists }
      });

      if (studentExists) {
        return res
          .status(400)
          .json({ error: `Aluno ${emailExists} já existe` });
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
      return res
        .status(400)
        .json({ error: 'Id inválido, aluno não existe' });
    }

    await Student.destroy({ where: { id } });

    return res.json({ message: 'Aluno removido com sucesso' });
  }

  async show({ res }) {
    const students = await Student.findAll();

    return res.json(students);
  }

  async index(req, res) {
    const { id } = req.params;
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    return res.json(student);
  }
}

export default new StudentController();
