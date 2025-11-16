import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '../../../Components/Layout'
import Card from '../../../Components/Card'
import Badge from '../../../Components/Badge'
import Button from '../../../Components/Button'

export default function History({ batches, fee_structures, batch }) {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const handleBatchClick = (batchId) => {
    router.get(`/admin/fee_structures/history?batch_id=${batchId}`, {}, {
      preserveState: false
    })
  }

  const handleBackToList = () => {
    router.get('/admin/fee_structures/history')
  }

  return (
    <Layout>
      <Head title="Fee History" />

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link href="/admin/fee_structures">
            <Button variant="secondary" size="sm">
              Back to Fee Structures
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Fee Structure History</h1>
          <p className="mt-1 text-sm text-gray-600">
            View fee changes over time for each batch
          </p>
        </div>

        {/* Show batch list if no specific batch selected */}
        {!batch && batches.length > 0 && (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Click on a batch to view its fee history
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {batches.map((batchItem) => (
                <Card
                  key={batchItem.id}
                  padding={false}
                  className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleBatchClick(batchItem.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {batchItem.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {batchItem.course_name}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {batchItem.current_fee ? (
                        <>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Current Fee:</span>
                            <span className="text-lg font-bold text-green-600">
                              {formatAmount(batchItem.current_fee.amount)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500">Type:</span>
                            <Badge variant="info">
                              {batchItem.current_fee.fee_type.replace('_', ' ')}
                            </Badge>
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500 italic">
                          No current fee structure
                        </div>
                      )}

                      <div className="mt-3 text-xs text-gray-500">
                        Total fee changes: {batchItem.fee_count}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Show fee history for selected batch */}
        {batch && fee_structures.length > 0 && (
          <>
            <Card className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{batch.name}</h2>
                  <p className="text-sm text-gray-500">{batch.course_name}</p>
                </div>
                <Button variant="secondary" onClick={handleBackToList}>
                  Back to Batch List
                </Button>
              </div>
            </Card>

            <Card padding={false}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fee Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Effective From
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Effective To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fee_structures.map((feeStructure) => (
                      <tr key={feeStructure.id} className={feeStructure.current ? 'bg-green-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="info">
                            {feeStructure.class_type.replace('_', '-')}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {feeStructure.fee_type.replace('_', ' ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatAmount(feeStructure.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(feeStructure.effective_from).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {feeStructure.effective_to
                              ? new Date(feeStructure.effective_to).toLocaleDateString()
                              : 'Ongoing'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {feeStructure.current ? (
                            <Badge variant="success">Current</Badge>
                          ) : feeStructure.active ? (
                            <Badge variant="warning">Future</Badge>
                          ) : (
                            <Badge variant="secondary">Expired</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Timeline Visualization */}
            <Card className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Change Timeline</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                <div className="space-y-6">
                  {fee_structures.map((feeStructure, index) => (
                    <div key={feeStructure.id} className="relative pl-10">
                      <div className={`absolute left-2 w-4 h-4 rounded-full ${
                        feeStructure.current
                          ? 'bg-green-500'
                          : feeStructure.active
                          ? 'bg-yellow-500'
                          : 'bg-gray-400'
                      }`}></div>
                      <div className={`p-4 rounded-lg ${
                        feeStructure.current
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {formatAmount(feeStructure.amount)}
                              <Badge variant="info" className="ml-2">
                                {feeStructure.fee_type.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {new Date(feeStructure.effective_from).toLocaleDateString()}
                              {feeStructure.effective_to && (
                                <> to {new Date(feeStructure.effective_to).toLocaleDateString()}</>
                              )}
                            </div>
                          </div>
                          {feeStructure.current && (
                            <Badge variant="success">Current</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </>
        )}

        {/* Empty states */}
        {!batch && batches.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No batches found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create batches first to manage their fee structures
              </p>
            </div>
          </Card>
        )}

        {batch && fee_structures.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No fee history</h3>
              <p className="mt-1 text-sm text-gray-500">
                This batch has no fee structures yet
              </p>
              <div className="mt-6">
                <Link href="/admin/fee_structures/new">
                  <Button variant="primary">
                    Create Fee Structure
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  )
}
