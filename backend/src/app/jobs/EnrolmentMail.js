import pt from 'date-fns/locale/pt';
import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class EnrolmentMail {
  get key() {
    return 'EnrolmentMail';
  }

  async handle({ data }) {
    const { enrolment } = data;

    await Mail.sendMail({
      to: `${enrolment.student.name} <${enrolment.student.email}>`,
      subject: 'Matrícula efetuada',
      template: 'enrolment',
      context: {
        price: enrolment.price,
        student: enrolment.student.name,
        plan: enrolment.plan.title,
        initialDate: format(parseISO(enrolment.start_date), 'dd/MM/yyyy', {
          locale: pt
        }),
        endDate: format(parseISO(enrolment.end_date), 'dd/MM/yyyy', {
          locale: pt
        })
      }
    });
  }
}

export default new EnrolmentMail();
