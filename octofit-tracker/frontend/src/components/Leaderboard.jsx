import ResourcePage from './ResourcePage.jsx'
import { fetchRecords as fetch } from '../api.js'

const columns = [
  { key: 'user.name', label: 'Athlete' },
  { key: 'points', label: 'Points' },
  { key: 'updatedAt', label: 'Last updated' },
]

export default function Leaderboard() {
  return (
    <ResourcePage
      columns={columns}
      description="Celebrate consistency and see how your athletes are climbing."
      endpoint="/api/leaderboard/"
      loader={fetch}
      title="Leaderboard"
    />
  )
}
