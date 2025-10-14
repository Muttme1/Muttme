
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
        <section className="max-w-3xl mx-auto text-center bg-[var(--mm-bg)] rounded-3xl p-8 mb-6">
  <h1 className="text-3xl md:text-4xl font-extrabold">Find your furry soulmate</h1>
  <p className="text-gray-600 mt-2">Swipe to “Soul Match” and connect with local rescues.</p>
  <div className="mt-4 flex justify-center gap-3">
    <a href="/shelter" className="btn btn-muted">Shelter Dashboard</a>
    <a href="/add" className="btn btn-primary">Add a Dog</a>
  </div>
</section>
        <div className="flex items-center gap-3">
          <img src="/logo-192.png" alt="Muttme" className="w-12" />
          <h1 className="text-2xl font-bold">Muttme</h1>
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
          {dogs.length === 0 && (
         <div className="max-w-xl mx-auto text-center text-gray-500 py-20">
    No dogs match your filters yet. Try adjusting filters or check back soon!
    </div>
  )
}
          {dogs.map((d) => (<SwipeCard key={d.id} dog={d} user={user} />))}
        </div>
      </main>
      <footer className="max-w-3xl mx-auto mt-10 text-center text-sm text-gray-500 py-10">
  Made with ♥ for adoptable pups · <a className="underline" href="/about">About</a> · <a className="underline" href="/faq">FAQ</a>
</footer>
    </div>
  )
}
