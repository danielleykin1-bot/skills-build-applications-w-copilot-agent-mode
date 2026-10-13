import ResourcePage from './ResourcePage.jsx'
import { fetchRecords as fetch } from '../api.js'

const columns = [
  { key: 'user.name', label: 'Athlete' },
  { key: 'type', label: 'Activity' },
  { key: 'durationMinutes', label: 'Minutes' },
  { key: 'distanceKilometers', label: 'Distance (km)' },
  { key: 'calories', label: 'Calories' },
  { key: 'recordedAt', label: 'Recorded' },
]

export default function Activities() {
  return (
    <ResourcePage
      columns={columns}
      description="Every effort adds up. See the latest training across your community."
      endpoint="/api/activities/"
      loader={fetch}
      title="Activities"
    />
  )
}
