import { Head, Link } from '@inertiajs/react'
import Layout from '../../../Components/Layout'
import StudentForm from './Form'

export default function Edit({ student, statuses }) {
  return (
    <Layout>
      <Head title={`Edit ${student.first_name} ${student.last_name}`} />

      <div className="mb-6">
        <Link href={`/teacher/students/${student.id}`} className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">
          &larr; Back to Student Profile
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Edit Student: {student.first_name} {student.last_name}
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Update student information and settings
        </p>

        <StudentForm
          student={student}
          statuses={statuses}
        />
      </div>
    </Layout>
  )
}
