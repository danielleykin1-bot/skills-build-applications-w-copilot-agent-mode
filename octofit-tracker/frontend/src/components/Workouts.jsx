import ResourcePage from './ResourcePage.jsx'
import { fetchRecords as fetch } from '../api.js'

const columns = [
  { key: 'title', label: 'Workout' },
  { key: 'description', label: 'Plan' },
  { key: 'difficulty', label: 'Level' },
  { key: 'durationMinutes', label: 'Minutes' },
]

export default function Workouts() {
  return (
    <ResourcePage
      columns={columns}
      description="Choose a workout that fits your goals and your day."
      endpoint="/api/workouts/"
      loader={fetch}
      title="Workouts"
    />
  )
}
