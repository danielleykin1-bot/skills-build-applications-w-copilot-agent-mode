import ResourcePage from './ResourcePage.jsx'
import { fetchRecords as fetch } from '../api.js'

const columns = [
  { key: 'name', label: 'Athlete' },
  { key: 'email', label: 'Email' },
  { key: 'team.name', label: 'Team' },
]

export default function Users() {
  return (
    <ResourcePage
      columns={columns}
      description="Meet the athletes making progress one activity at a time."
      endpoint="/api/users/"
      loader={fetch}
      title="Athletes"
    />
  )
}
