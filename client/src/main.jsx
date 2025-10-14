
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import App from './pages/App'
import DogPage from './pages/DogPage'
import AddDog from './pages/AddDog'
import Shelter from './pages/Shelter'
import './index.css'
import About from './pages/About'
import FAQ from './pages/FAQ'


function Nav(){
  return (
    <nav className="max-w-xl mx-auto flex items-center justify-between py-4">
      <Link to="/" className="text-xl font-bold">MuttMe</Link>
      <div className="flex gap-4 text-sm">
        <Link to="/add" className="text-blue-600">Add Dog</Link>
        <Link to="/shelter" className="text-blue-600">Shelter</Link>
      </div>
    </nav>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dog/:id" element={<DogPage />} />
        <Route path="/add" element={<AddDog />} />
        <Route path="/shelter" element={<Shelter />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
