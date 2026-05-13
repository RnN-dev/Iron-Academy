import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppStateProvider } from './context/AppStateProvider'
import { DashboardPage } from './pages/DashboardPage'
import { ExercisesPage } from './pages/ExercisesPage'
import { TodayPage } from './pages/TodayPage'
import { WorkoutsPage } from './pages/WorkoutsPage'

export default function App() {
  return (
    <BrowserRouter>
      <AppStateProvider>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/exercicios" element={<ExercisesPage />} />
          <Route path="/treinos" element={<WorkoutsPage />} />
          <Route path="/hoje" element={<TodayPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppStateProvider>
    </BrowserRouter>
  )
}
