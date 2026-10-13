import ResourcePage from './ResourcePage.jsx'
import { fetchRecords as fetch } from '../api.js'

const columns = [
  { key: 'name', label: 'Team' },
  { key: 'description', label: 'About' },
  { key: 'members.length', label: 'Members' },
]

export default function Teams() {
  return (
    <ResourcePage
      columns={columns}
      description="Find your crew, encourage one another, and move forward together."
      endpoint="/api/teams/"
      loader={fetch}
      title="Teams"
    />
  )
}
