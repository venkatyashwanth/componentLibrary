import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import styles from '../App.module.scss'

export function DocsLayout() {
  return (
    <>
      <header className={styles.mainNavigation}>
        <nav aria-label="Main navigation">
          <span className={styles.brand}>Component Library</span>
        </nav>
      </header>
      <div className={styles.playgroundLayout}>
        <Sidebar />
        <main className={styles.demo}>
          <Outlet />
        </main>
      </div>
    </>
  )
}
