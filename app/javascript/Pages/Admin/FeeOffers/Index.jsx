import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '../../../Components/Layout'
import Card from '../../../Components/Card'
import Badge from '../../../Components/Badge'
import Button from '../../../Components/Button'
import TextInput from '../../../Components/TextInput'
import SelectInput from '../../../Components/SelectInput'

export default function Index({ fee_offers, filters, pagination, offer_types, statuses, applicable_to_options }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [offerType, setOfferType] = useState(filters.offer_type || '')
  const [status, setStatus] = useState(filters.status || '')
  const [applicableTo, setApplicableTo] = useState(filters.applicable_to || '')
  const [timeFilter, setTimeFilter] = useState(filters.time_filter || '')

  const handleSearch = () => {
    router.get('/admin/fee_offers', {
      search: searchTerm,
      offer_type: offerType,
      status: status,
      applicable_to: applicableTo,
      time_filter: timeFilter
    }, {
      preserveState: true,
      preserveScroll: true
    })
  }

  const handleReset = () => {
    setSearchTerm('')
    setOfferType('')
    setStatus('')
    setApplicableTo('')
    setTimeFilter('')
    router.get('/admin/fee_offers', {}, {
      preserveState: true,
      preserveScroll: true
    })
  }

  const handlePageChange = (page) => {
    router.get('/admin/fee_offers', {
      page: page,
      search: searchTerm,
      offer_type: offerType,
      status: status,
      applicable_to: applicableTo,
      time_filter: timeFilter
    }, {
      preserveState: true,
      preserveScroll: true
    })
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this fee offer?')) {
      router.delete(`/admin/fee_offers/${id}`)
    }
  }

  const offerTypeOptions = offer_types.map(type => ({
    value: type,
    label: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }))

  const statusOptions = statuses.map(s => ({
    value: s,
    label: s.charAt(0).toUpperCase() + s.slice(1)
  }))

  const applicableToOptions = applicable_to_options.map(option => ({
    value: option,
    label: option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }))

  const timeFilterOptions = [
    { value: 'current', label: 'Current' },
    { value: 'upcoming', label: 'Upcoming' }
  ]

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const getOfferDetails = (offer) => {
    if (offer.offer_type === 'percentage_discount') {
      return `${offer.discount_percentage}% off`
    } else if (offer.offer_type === 'flat_discount') {
      return `${formatAmount(offer.discount_amount)} off`
    } else if (offer.offer_type === 'special_package' && offer.special_price) {
      return `Special price: ${formatAmount(offer.special_price)}`
    }
    return 'N/A'
  }

  return (
    <Layout>
      <Head title="Fee Offers" />

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fee Offers</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage discount offers and special packages
            </p>
          </div>
          <Link href="/admin/fee_offers/new">
            <Button variant="primary">
              Create Fee Offer
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <TextInput
                label="Search"
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by offer name..."
              />
            </div>

            <SelectInput
              label="Offer Type"
              name="offer_type"
              value={offerType}
              onChange={(e) => setOfferType(e.target.value)}
              options={offerTypeOptions}
              placeholder="All Types"
            />

            <SelectInput
              label="Status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={statusOptions}
              placeholder="All Statuses"
            />

            <SelectInput
              label="Applicable To"
              name="applicable_to"
              value={applicableTo}
              onChange={(e) => setApplicableTo(e.target.value)}
              options={applicableToOptions}
              placeholder="All"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <SelectInput
              label="Time Filter"
              name="time_filter"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              options={timeFilterOptions}
              placeholder="All Offers"
            />
          </div>

          <div className="flex space-x-2 mt-4">
            <Button
              variant="primary"
              onClick={handleSearch}
              className="flex-1"
            >
              Search
            </Button>
            <Button
              variant="secondary"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </Card>

        {/* Results Info */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {fee_offers.length} of {pagination.total_count} fee offers
        </div>

        {/* Fee Offers Grid */}
        {fee_offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fee_offers.map((offer) => (
              <Card key={offer.id} padding={false} className="hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {offer.name}
                      </h3>
                      {offer.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {offer.description}
                        </p>
                      )}
                    </div>
                    <Badge variant={
                      offer.status === 'active' ? 'success' :
                      offer.status === 'draft' ? 'warning' :
                      offer.status === 'expired' ? 'secondary' :
                      'danger'
                    }>
                      {offer.status}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Offer Details:</span>
                      <span className="text-sm font-semibold text-green-600">
                        {getOfferDetails(offer)}
                      </span>
                    </div>

                    {offer.duration_months && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Duration:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {offer.duration_months} months
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Applicable To:</span>
                      <Badge variant="info">
                        {offer.applicable_to.replace(/_/g, ' ')}
                      </Badge>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-500">
                        Valid: {new Date(offer.valid_from).toLocaleDateString()} - {new Date(offer.valid_to).toLocaleDateString()}
                      </div>
                      {offer.current && (
                        <Badge variant="success" className="mt-2">
                          Currently Active
                        </Badge>
                      )}
                      {offer.expired && (
                        <Badge variant="secondary" className="mt-2">
                          Expired
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-6 py-3 bg-gray-50 flex justify-end space-x-2">
                  <Link href={`/admin/fee_offers/${offer.id}/edit`}>
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(offer.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No fee offers found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filters.search || filters.offer_type ? 'Try adjusting your filters' : 'Get started by creating a new fee offer'}
              </p>
              {!filters.search && !filters.offer_type && (
                <div className="mt-6">
                  <Link href="/admin/fee_offers/new">
                    <Button variant="primary">
                      Create Fee Offer
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {pagination.current_page} of {pagination.total_pages}
            </div>

            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
              >
                Previous
              </Button>

              {[...Array(pagination.total_pages)].map((_, index) => {
                const page = index + 1
                if (
                  page === 1 ||
                  page === pagination.total_pages ||
                  (page >= pagination.current_page - 2 && page <= pagination.current_page + 2)
                ) {
                  return (
                    <Button
                      key={page}
                      variant={page === pagination.current_page ? 'primary' : 'secondary'}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  )
                } else if (
                  page === pagination.current_page - 3 ||
                  page === pagination.current_page + 3
                ) {
                  return <span key={page} className="px-2 py-2">...</span>
                }
                return null
              })}

              <Button
                variant="secondary"
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.total_pages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
