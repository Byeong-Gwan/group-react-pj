import { useMemo } from 'react'
import './App.css'
import Nav from './components/Nav'
import Dashboard from './features/dashboard/Dashboard'
import AddExpense from './features/add/AddExpense'
import AnalysisResult from './features/analysis/AnalysisResult'
import History from './features/history/History'
import AIReport from './features/report/AIReport'
import Board from './features/board/Board'
import { Routes, Route, useLocation } from 'react-router-dom'

function App() {
  const location = useLocation()
  const analysisItems = useMemo(() => location.state?.analysisItems || [], [location.state])

  return (
    <div className="container">
      <Nav />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddExpense />} />
        <Route path="/analysis" element={<AnalysisResult items={analysisItems} />} />
        <Route path="/history" element={<History />} />
        <Route path="/report" element={<AIReport />} />
        <Route path="/board" element={<Board />} />
      </Routes>
    </div>
  )
}

export default App
