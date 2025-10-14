
import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import SwipeCard from '../shared/SwipeCard'
import { watchAuth, signInWithGoogle, logout } from '../firebase'

export default function App(){
  const [dogs, setDogs] = useState([])
  const [user, setUser] = useState(null)
  const [filters, setFilters] = useState({ kids:false, dogs:false, cats:false, energy:'' })

  useEffect(()=>{ watchAuth(setUser); loadDogs() },[])

  async function loadDogs(f = filters){
    let q = supabase.from('dogs').select('*')
    if (f.kids) q = q.eq('good_with_kids', true)
    if (f.dogs) q = q.eq('good_with_dogs', true)
    if (f.cats) q = q.eq('good_with_cats', true)
    if (f.energy) q = q.eq('energy_level', f.energy)
    const { data } = await q
    setDogs(data || [])
  }

  function updateFilter(key, value){
    const next = { ...filters, [key]: value }
    setFilters(next)
    loadDogs(next)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-rose-50 p-6 font-sans">
      <header className="max-w-xl mx-auto flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src="/logo-192.png" alt="MuttMe" className="w-12" />
          <h1 className="text-2xl font-bold">MuttMe</h1>
        </div>
        {user ? (
          <button onClick={logout} className="bg-gray-200 px-3 py-1 rounded text-sm">Logout</button>
        ) : (
          <button onClick={signInWithGoogle} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Sign in</button>
        )}
      </header>

      <section className="max-w-xl mx-auto mb-4 flex flex-wrap gap-3 items-center">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={filters.kids} onChange={e=>updateFilter('kids', e.target.checked)} /> Kids
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={filters.dogs} onChange={e=>updateFilter('dogs', e.target.checked)} /> Dogs
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={filters.cats} onChange={e=>updateFilter('cats', e.target.checked)} /> Cats
        </label>
        <select className="border rounded px-2 py-1 text-sm" value={filters.energy} onChange={e=>updateFilter('energy', e.target.value)}>
          <option value="">Energy</option>
          <option>Low</option><option>Medium</option><option>High</option>
        </select>
      </section>

      <main className="max-w-xl mx-auto">
        <div className="h-[520px] relative">
          {dogs.map((d) => (<SwipeCard key={d.id} dog={d} user={user} />))}
        </div>
      </main>
    </div>
  )
}
