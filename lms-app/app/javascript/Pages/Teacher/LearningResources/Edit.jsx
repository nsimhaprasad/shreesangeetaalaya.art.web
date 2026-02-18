import { Head } from '@inertiajs/react'
import Layout from '../../../Components/Layout'
import ResourceForm from './Form'

export default function Edit({ resource, resource_types, visibilities }) {
  return (
    <Layout>
      <Head title="Edit Resource" />

      <div className="mb-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Resource</h1>
          <p className="mt-1 text-sm text-gray-600">
            Update the details of this learning resource
          </p>
        </div>

        <ResourceForm
          resource={resource}
          resource_types={resource_types}
          visibilities={visibilities}
        />
      </div>
    </Layout>
  )
}
