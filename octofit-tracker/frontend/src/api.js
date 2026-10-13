const codespaceName = import.meta.env.VITE_CODESPACE_NAME

export const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

function recordsFrom(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (payload && typeof payload === 'object') {
    for (const key of ['results', 'items', 'data', 'records']) {
      if (Array.isArray(payload[key])) {
        return payload[key]
      }
    }
  }

  throw new Error('The API response did not contain a list of records.')
}

export async function fetchRecords(endpoint, signal) {
  let response
  try {
    response = await fetch(`${apiBaseUrl}${endpoint}`, { signal })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error
    }
    throw new Error(`Could not reach the API at ${apiBaseUrl}. Check that the backend is running on port 8000.`)
  }

  const body = await response.text()
  let payload
  try {
    payload = body ? JSON.parse(body) : null
  } catch {
    throw new Error(`The API returned an invalid response (HTTP ${response.status}).`)
  }

  if (!response.ok) {
    const message = payload && typeof payload === 'object' && typeof payload.error === 'string'
      ? payload.error
      : `Request failed with HTTP ${response.status}.`
    throw new Error(message)
  }

  return recordsFrom(payload)
}
