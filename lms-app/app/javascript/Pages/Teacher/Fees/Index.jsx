import { Head } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '@components/Layout'
import { Card, Badge, StatusBadge, Progress, EmptyState } from '@components/UI'

const icons = {
  chevronDown: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  chevronUp: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  ),
  tag: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  currency: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

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

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Fee Information</h1>
          <p className="text-gray-500 text-sm mt-1">View current fee structures for your batches</p>
        </div>

        {current_offers.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Current Offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {current_offers.map((offer) => (
                <Card key={offer.id} className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{offer.name}</h3>
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
                    <div className="text-xs text-gray-500 pt-2 border-t border-green-200">
                      Valid till {new Date(offer.valid_to).toLocaleDateString()}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Batches</h2>

          {batches.length > 0 ? (
            <div className="space-y-3">
              {batches.map((batch) => (
                <Card key={batch.id} padding={false} className="overflow-hidden">
                  <div
                    className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleBatchClick(batch)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900">{batch.name}</h3>
                          <Badge variant="info">{batch.class_type.replace('_', '-')}</Badge>
                          <StatusBadge status={batch.status} />
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
                          <div className="text-sm text-gray-400 italic">No fee set</div>
                        )}
                      </div>

                      <div className="ml-4 text-gray-400">
                        {selectedBatch?.id === batch.id ? icons.chevronUp : icons.chevronDown}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        {icons.users}
                        Students: {batch.enrollment_count}{batch.max_students ? `/${batch.max_students}` : ''}
                      </span>
                    </div>
                  </div>

                  {selectedBatch?.id === batch.id && (
                    <div className="border-t border-gray-100 bg-gray-50 p-5 space-y-6">
                      {batch.current_fee && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Current Fee Details</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <span className="text-xs text-gray-500">Amount</span>
                              <div className="text-lg font-bold text-gray-900">
                                {formatAmount(batch.current_fee.amount)}
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <span className="text-xs text-gray-500">Class Type</span>
                              <div className="text-sm font-medium text-gray-900">
                                {batch.current_fee.class_type.replace('_', '-')}
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <span className="text-xs text-gray-500">Fee Type</span>
                              <div className="text-sm font-medium text-gray-900">
                                {batch.current_fee.fee_type.replace('_', ' ')}
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <span className="text-xs text-gray-500">Effective From</span>
                              <div className="text-sm font-medium text-gray-900">
                                {new Date(batch.current_fee.effective_from).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {batch.current_fee && current_offers.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Fee Calculator with Offers</h4>
                          <div className="space-y-3">
                            {current_offers.map((offer) => {
                              const discount = calculateDiscount(batch.current_fee.amount, offer)
                              const finalAmount = batch.current_fee.amount - discount

                              return (
                                <div key={offer.id} className="bg-green-50 rounded-lg p-4 border border-green-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">{offer.name}</span>
                                    {offer.duration_months && (
                                      <Badge variant="success">{offer.duration_months} months</Badge>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-3 gap-4 text-sm">
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
                      )}

                      {batch.fee_history.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Fee History</h4>
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {batch.fee_history.map((fee) => (
                                  <tr key={fee.id} className={fee.current ? 'bg-green-50' : ''}>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                      {formatAmount(fee.amount)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                      {fee.fee_type.replace('_', ' ')}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                      {new Date(fee.effective_from).toLocaleDateString()}
                                      {fee.effective_to && ` - ${new Date(fee.effective_to).toLocaleDateString()}`}
                                    </td>
                                    <td className="px-4 py-3">
                                      {fee.current ? (
                                        <Badge variant="success">Current</Badge>
                                      ) : fee.active ? (
                                        <Badge variant="warning">Future</Badge>
                                      ) : (
                                        <Badge variant="default">Expired</Badge>
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
            <EmptyState
              icon={icons.currency}
              title="No batches assigned"
              description="You don't have any batches assigned yet"
            />
          )}
        </div>
      </div>
    </Layout>
  )
}
