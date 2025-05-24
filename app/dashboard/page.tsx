// pages/admin/index.js

import Link from 'next/link'

export default function Admin() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <nav>
        <ul>
          <li><Link href="/admin/users">Manage Users</Link></li>
          <li><Link href="/admin/products">Manage Products</Link></li>
        </ul>
      </nav>
    </div>
  )
}
