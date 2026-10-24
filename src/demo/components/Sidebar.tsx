import { NavLink } from 'react-router-dom'
import styles from '../App.module.scss'

const components = [
  { label: 'Button', path: '/components/button' },
  { label: 'Input', path: '/components/input' },
]

export function Sidebar() {
  return (
    <aside className={styles.variantSidebar}>
      <p className={styles.sidebarLabel}>COMPONENTS</p>
      <nav className={styles.componentNav} aria-label="Components">
        {components.map(({ label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `${styles.variantLink} ${isActive ? styles.variantLinkActive : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
