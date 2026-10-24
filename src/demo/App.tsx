import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { DocsLayout } from './layouts/DocsLayout'
import styles from './App.module.scss'

const ButtonPage = lazy(() => import('./pages/ButtonPage'))
const InputPage = lazy(() => import('./pages/InputPage'))

function PageLoadingFallback() {
  return (
    <p className={styles.loading} role="status" aria-live="polite">
      Loading component documentation…
    </p>
  )
}

function NotFoundPage() {
  return (
    <section className={styles.notFound}>
      <p className={styles.eyebrow}>404</p>
      <h1>Page not found</h1>
      <p className={styles.description}>
        This component documentation page does not exist.
      </p>
    </section>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DocsLayout />}>
        <Route index element={<Navigate replace to="/components/button" />} />
        <Route
          path="components/button"
          element={
            <Suspense fallback={<PageLoadingFallback />}>
              <ButtonPage />
            </Suspense>
          }
        />
        <Route
          path="components/input"
          element={
            <Suspense fallback={<PageLoadingFallback />}>
              <InputPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
