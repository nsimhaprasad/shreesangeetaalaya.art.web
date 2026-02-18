import { Head, Link } from '@inertiajs/react'
import StudentForm from './Form'

export default function NewStudent({ student, statuses }) {
  return <StudentForm student={student || {}} statuses={statuses || ['active', 'inactive']} />
}
