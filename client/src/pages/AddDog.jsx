
import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { watchAuth, ADMIN_EMAIL } from '../firebase'
import { useNavigate } from 'react-router-dom'

export default function AddDog(){
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [breed, setBreed] = useState('')
  const [bio, setBio] = useState('')
  const [file, setFile] = useState(null)
  const [kids, setKids] = useState(false)
  const [dogs, setDogsOK] = useState(false)
  const [cats, setCats] = useState(false)
  const [energy, setEnergy] = useState('')
  const [saving, setSaving] = useState(false)
  const nav = useNavigate()

  useEffect(()=> watchAuth(setUser), [])

  const isAdmin = user?.email === "muttmeadoptablepets@gmail.com"

  async function handleSubmit(e){
    e.preventDefault()
    if(!isAdmin) return alert('You are not authorized to add dogs.')
    if(!name || !file) return alert('Please provide at least a name and a photo.')

    setSaving(true)
    try {
      const ext = file.name.split('.').pop()
      const filename = `dog_${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('dogs').upload(filename, file, { upsert: false })
      if(upErr) throw upErr
      const { data: pub } = supabase.storage.from('dogs').getPublicUrl(filename)
      const imgUrl = pub.publicUrl

      const { error: insErr } = await supabase.from('dogs').insert({
        name, age: age ? Number(age) : null, breed, bio, img: imgUrl,
        good_with_kids: kids, good_with_dogs: dogs, good_with_cats: cats, energy_level: energy
      })
      if(insErr) throw insErr

      alert('Dog added successfully!')
      nav('/')
    } catch(err){
      console.error(err)
      alert('Error adding dog: ' + (err.message || err))
    } finally {
      setSaving(false)
    }
  }

  if(!user) return <div className="max-w-xl mx-auto p-6">Please sign in to continue.</div>
  if(!isAdmin) return <div className="max-w-xl mx-auto p-6">Access denied. Only admin can add dogs.</div>

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add a New Dog</h2>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input className="border rounded px-3 py-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Age (years)" type="number" value={age} onChange={e=>setAge(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Breed" value={breed} onChange={e=>setBreed(e.target.value)} />
        <textarea className="border rounded px-3 py-2" placeholder="Bio" value={bio} onChange={e=>setBio(e.target.value)} />
        <input className="border rounded px-3 py-2" type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} />

        <div className="grid grid-cols-2 gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={kids} onChange={e=>setKids(e.target.checked)} /> Good with kids
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={dogs} onChange={e=>setDogsOK(e.target.checked)} /> Good with dogs
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={cats} onChange={e=>setCats(e.target.checked)} /> Good with cats
          </label>
          <select className="border rounded px-3 py-2" value={energy} onChange={e=>setEnergy(e.target.value)}>
            <option value="">Energy level</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button disabled={saving} className="bg-teal-600 text-white rounded px-4 py-2">
          { saving ? 'Saving...' : 'Add Dog' }
        </button>
      </form>
    </div>
  )
}
