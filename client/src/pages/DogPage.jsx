
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabase'

export default function DogPage(){
  const { id } = useParams()
  const [dog, setDog] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(()=>{ supabase.from('dogs').select('*').eq('id', id).single().then(({ data })=>setDog(data)) },[id])

  async function submitInquiry(e){
    e.preventDefault(); if(!dog) return; setSending(true)
    try {
      const { error: insErr } = await supabase.from('inquiries').insert({ dog_id: dog.id, adopter_name: name, adopter_email: email, message })
      if (insErr) throw insErr
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-inquiry`
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` }, body: JSON.stringify({ dogName: dog.name, dogId: dog.id, adopterName: name, adopterEmail: email, message }) })
      const data = await res.json(); if (!res.ok || !data.ok) throw new Error(data.error || 'Email failed')
      alert('Inquiry sent! We’ll be in touch soon ❤️'); setName(''); setEmail(''); setMessage('')
    } catch (e) { console.error(e); alert('Could not send your inquiry. Please try again.') } finally { setSending(false) }
  }

  if(!dog) return <div className="max-w-xl mx-auto p-6">Loading...</div>

  return (
    <div className="max-w-xl mx-auto p-6">
      <Link to="/" className="text-sm text-blue-600">&larr; Back</Link>
      <div className="mt-3">
        <img src={dog.img} alt={dog.name} className="w-full h-64 object-cover rounded-lg"/>
        <h2 className="text-2xl font-bold mt-3">{dog.name} <span className="text-sm text-gray-500">· {dog.age}</span></h2>
        <p className="text-sm text-gray-600">{dog.breed}</p>
        <p className="mt-3 text-gray-800">{dog.bio}</p>
        <hr className="my-6"/>
        <h3 className="text-lg font-semibold mb-2">Adopt {dog.name}</h3>
        <form onSubmit={submitInquiry} className="grid gap-3">
          <input className="border rounded px-3 py-2" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} required />
          <input className="border rounded px-3 py-2" placeholder="Your email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <textarea className="border rounded px-3 py-2" placeholder="Why are you interested?" value={message} onChange={e=>setMessage(e.target.value)} />
          <button disabled={sending} className="bg-rose-600 text-white rounded px-4 py-2">{sending ? 'Sending…' : 'Send Inquiry'}</button>
        </form>
      </div>
    </div>
  )
}
