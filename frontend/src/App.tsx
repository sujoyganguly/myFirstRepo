import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar     from './components/Navbar';
import Dashboard  from './components/Dashboard';
import TicketList from './components/TicketList';
import TicketForm from './components/TicketForm';
import TicketDetail from './components/TicketDetail';
import SLAMonitor from './components/SLAMonitor';
import SOPPage    from './components/SOPPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/"            element={<Dashboard />} />
            <Route path="/tickets"     element={<TicketList />} />
            <Route path="/tickets/:id" element={<TicketDetail />} />
            <Route path="/new"         element={<TicketForm />} />
            <Route path="/sla"         element={<SLAMonitor />} />
            <Route path="/sop"         element={<SOPPage />} />
          </Routes>
        </main>
        <footer className="border-t border-gray-200 bg-white mt-10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between text-xs text-gray-400">
            <span>Srijan Nirvana Phase 1 — Resident Support Portal</span>
            <span>ITSM v1.0 · Powered by Srijan Facilities</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
