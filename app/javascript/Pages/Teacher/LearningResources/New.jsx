import { Head } from '@inertiajs/react'
import Layout from '@components/Layout'
import ResourceForm from './Form'

export default function New({ resource, resource_types, visibilities }) {
  return (
    <Layout>
      <Head title="Upload New Resource" />

      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Upload New Resource</h1>
          <p className="text-gray-500 text-sm mt-1">
            Add a new learning resource to share with your students
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
