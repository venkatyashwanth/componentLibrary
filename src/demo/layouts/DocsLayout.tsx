import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import styles from '../App.module.scss'

export function DocsLayout() {
  return (
    <div className={styles.playgroundLayout}>
      <Sidebar />
      <main className={styles.demo}>
        <Outlet />
      </main>
    </div>
  )
}
