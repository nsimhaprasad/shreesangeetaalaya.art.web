import { Head } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '../../../Components/Layout'
import Card from '../../../Components/Card'
import Badge from '../../../Components/Badge'

export default function Index({ batches, current_offers, class_types, fee_types }) {
  const [selectedBatch, setSelectedBatch] = useState(null)

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const calculateDiscount = (baseAmount, offer) => {
    if (offer.offer_type === 'percentage_discount') {
      return baseAmount * (offer.discount_percentage / 100)
    } else if (offer.offer_type === 'flat_discount') {
      return offer.discount_amount
    }
    return 0
  }

  const handleBatchClick = (batch) => {
    setSelectedBatch(selectedBatch?.id === batch.id ? null : batch)
  }

  return (
    <Layout>
      <Head title="Fee Information" />

      <div className="mb-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Fee Information</h1>
          <p className="mt-1 text-sm text-gray-600">
            View current fee structures for your batches
          </p>
        </div>

        {/* Current Offers Section */}
        {current_offers.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {current_offers.map((offer) => (
                <Card key={offer.id} className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{offer.name}</h3>
                    <Badge variant="success">Active</Badge>
                  </div>
                  {offer.description && (
                    <p className="text-sm text-gray-600 mb-3">{offer.description}</p>
                  )}
                  <div className="space-y-2">
                    {offer.offer_type === 'percentage_discount' && (
                      <div className="text-2xl font-bold text-green-600">
                        {offer.discount_percentage}% OFF
                      </div>
                    )}
                    {offer.offer_type === 'flat_discount' && (
                      <div className="text-2xl font-bold text-green-600">
                        {formatAmount(offer.discount_amount)} OFF
                      </div>
                    )}
                    {offer.offer_type === 'special_package' && offer.special_price && (
                      <div className="text-2xl font-bold text-green-600">
                        Special: {formatAmount(offer.special_price)}
                      </div>
                    )}
                    {offer.duration_months && (
                      <div className="text-sm text-gray-600">
                        For {offer.duration_months} months package
                      </div>
                    )}
                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-300">
                      Valid till {new Date(offer.valid_to).toLocaleDateString()}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Batches and Fee Structures */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Batches</h2>

          {batches.length > 0 ? (
            <div className="space-y-4">
              {batches.map((batch) => (
                <Card key={batch.id} padding={false} className="overflow-hidden">
                  {/* Batch Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleBatchClick(batch)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">{batch.name}</h3>
                          <Badge variant="info">
                            {batch.class_type.replace('_', '-')}
                          </Badge>
                          <Badge variant={batch.status === 'active' ? 'success' : 'secondary'}>
                            {batch.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{batch.course_name}</p>
                      </div>

                      <div className="text-right">
                        {batch.current_fee ? (
                          <div>
                            <div className="text-2xl font-bold text-gray-900">
                              {formatAmount(batch.current_fee.amount)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {batch.current_fee.fee_type.replace('_', ' ')}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic">No fee set</div>
                        )}
                      </div>

                      <div className="ml-4">
                        <svg
                          className={`w-6 h-6 text-gray-400 transition-transform ${
                            selectedBatch?.id === batch.id ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                      <span>Students: {batch.enrollment_count}{batch.max_students ? `/${batch.max_students}` : ''}</span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedBatch?.id === batch.id && (
                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                      {/* Current Fee Details */}
                      {batch.current_fee && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Current Fee Details</h4>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <span className="text-xs text-gray-500">Amount</span>
                                <div className="text-lg font-bold text-gray-900">
                                  {formatAmount(batch.current_fee.amount)}
                                </div>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">Class Type</span>
                                <div className="text-sm font-medium text-gray-900">
                                  {batch.current_fee.class_type.replace('_', '-')}
                                </div>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">Fee Type</span>
                                <div className="text-sm font-medium text-gray-900">
                                  {batch.current_fee.fee_type.replace('_', ' ')}
                                </div>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">Effective From</span>
                                <div className="text-sm font-medium text-gray-900">
                                  {new Date(batch.current_fee.effective_from).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Fee Calculator with Offers */}
                      {batch.current_fee && current_offers.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Fee Calculator with Offers</h4>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="space-y-3">
                              {current_offers.map((offer) => {
                                const discount = calculateDiscount(batch.current_fee.amount, offer)
                                const finalAmount = batch.current_fee.amount - discount

                                return (
                                  <div key={offer.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium text-gray-900">{offer.name}</span>
                                      <Badge variant="success">
                                        {offer.duration_months} months
                                      </Badge>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                      <div>
                                        <span className="text-xs text-gray-600">Base Fee:</span>
                                        <div className="font-medium">{formatAmount(batch.current_fee.amount)}</div>
                                      </div>
                                      <div>
                                        <span className="text-xs text-gray-600">Discount:</span>
                                        <div className="font-medium text-green-600">-{formatAmount(discount)}</div>
                                      </div>
                                      <div>
                                        <span className="text-xs text-gray-600">Final Fee:</span>
                                        <div className="font-bold text-gray-900">{formatAmount(finalAmount)}</div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Fee History */}
                      {batch.fee_history.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Fee History</h4>
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                    Amount
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                    Type
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                    Effective From
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                    Effective To
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {batch.fee_history.map((fee) => (
                                  <tr key={fee.id} className={fee.current ? 'bg-green-50' : ''}>
                                    <td className="px-4 py-2 text-sm font-medium text-gray-900">
                                      {formatAmount(fee.amount)}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-600">
                                      {fee.fee_type.replace('_', ' ')}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-600">
                                      {new Date(fee.effective_from).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-600">
                                      {fee.effective_to
                                        ? new Date(fee.effective_to).toLocaleDateString()
                                        : 'Ongoing'}
                                    </td>
                                    <td className="px-4 py-2">
                                      {fee.current ? (
                                        <Badge variant="success">Current</Badge>
                                      ) : fee.active ? (
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
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No batches assigned</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any batches assigned yet.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  )
}
