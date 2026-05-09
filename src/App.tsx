import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { PlanPage } from './pages/PlanPage'
import { VideosPage } from './pages/Videos'
import { PesoPage } from './pages/Peso'
import { DietaPage } from './pages/Dieta'
import { GuiaPage } from './pages/Guia'
import { LogrosPage } from './pages/Logros'
import { StatsPage } from './pages/Stats'
import { AjustesPage } from './pages/Ajustes'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: 'plan', element: <PlanPage /> },
        { path: 'videos', element: <VideosPage /> },
        { path: 'peso', element: <PesoPage /> },
        { path: 'dieta', element: <DietaPage /> },
        { path: 'logros', element: <LogrosPage /> },
        { path: 'stats', element: <StatsPage /> },
        { path: 'guia', element: <GuiaPage /> },
        { path: 'ajustes', element: <AjustesPage /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') },
)

function App() {
  return <RouterProvider router={router} />
}

export default App
