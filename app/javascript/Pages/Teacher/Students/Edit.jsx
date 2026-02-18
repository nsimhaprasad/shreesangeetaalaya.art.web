import StudentForm from './Form'

export default function EditStudent({ student, statuses }) {
  return <StudentForm student={student} statuses={statuses || ['active', 'inactive']} />
}
