import { useEffect, useState } from 'react'
import './ResourcePage.css'

function valueFor(record, key) {
  const value = key.split('.').reduce((current, part) => current?.[part], record)
  if (value === null || value === undefined || value === '') {
    return '-'
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }
  if (typeof value === 'object') {
    return value.name || value.title || value.email || value._id || JSON.stringify(value)
  }
  return value
}

function ResourcePage({ title, description, endpoint, columns, loader }) {
  const [records, setRecords] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    loader(endpoint, controller.signal)
      .then(setRecords)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [endpoint, loader, reloadKey])

  return (
    <section aria-labelledby="page-title">
      <div className="page-heading d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <p className="eyebrow mb-2">OCTOFIT TRACKER</p>
          <h1 className="h2 mb-2" id="page-title">{title}</h1>
          <p className="text-secondary mb-0">{description}</p>
        </div>
        <button
          className="btn btn-outline-success refresh-button"
          disabled={loading}
          onClick={() => {
            setError('')
            setLoading(true)
            setReloadKey((key) => key + 1)
          }}
          type="button"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-start gap-2" role="alert">
          <span aria-hidden="true">!</span>
          <div><strong>Could not load {title.toLowerCase()}.</strong> {error}</div>
        </div>
      )}

      <div className="resource-card">
        {loading ? (
          <div className="loading-state" role="status">
            <span className="spinner-border spinner-border-sm text-success" aria-hidden="true" />
            <span>Loading {title.toLowerCase()}…</span>
          </div>
        ) : error ? null : records.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">+</span>
            <h2 className="h5">Nothing to show yet</h2>
            <p className="text-secondary mb-0">When there’s new {title.toLowerCase()} data, it’ll appear here.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  {columns.map(({ label }) => <th key={label} scope="col">{label}</th>)}
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr key={record._id || record.id || record.email || record.title || index}>
                    {columns.map(({ key }) => (
                      <td key={key}>{valueFor(record, key)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="endpoint-note mt-3 mb-0">Data source: <code>{endpoint}</code></p>
    </section>
  )
}

export default ResourcePage
