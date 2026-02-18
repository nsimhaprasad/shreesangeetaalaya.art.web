import { Head, Link } from '@inertiajs/react'
import Layout from '../../../Components/Layout'
import StudentForm from './Form'

export default function New({ student, statuses }) {
  return (
    <Layout>
      <Head title="Add New Student" />

      <div className="mb-6">
        <Link href="/teacher/students" className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">
          &larr; Back to Students
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Student</h1>
        <p className="text-sm text-gray-600 mb-6">
          Create a new student profile and enroll them in your classes
        </p>

        <StudentForm
          student={student}
          statuses={statuses}
        />
      </div>
    </Layout>
  )
}
