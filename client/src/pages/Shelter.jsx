
import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { watchAuth, ADMIN_EMAIL } from '../firebase'
import { Link } from 'react-router-dom'

export default function Shelter(){
  const [user, setUser] = useState(null)
  const [dogs, setDogs] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [testing, setTesting] = useState(false)

  useEffect(()=> { watchAuth(setUser) },[])
  useEffect(()=> {
    if (!user || user.email !== ADMIN_EMAIL) return
    supabase.from('dogs').select('*').then(({ data }) => setDogs(data || []))
    supabase.from('inquiries').select('*').then(({ data }) => setInquiries(data || []))
  }, [user])

  if(!user) return <div className="max-w-2xl mx-auto p-6">Please sign in.</div>
  if(user.email !== ADMIN_EMAIL) return <div className="max-w-2xl mx-auto p-6">Access denied.</div>

  const counts = inquiries.reduce((acc, q) => { acc[q.dog_id] = (acc[q.dog_id] || 0) + 1; return acc }, {})

  async function sendTestEmail(){
    setTesting(true)
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-inquiry`
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` }, body: JSON.stringify({ test: true }) })
      const data = await res.json(); if (!res.ok || !data.ok) throw new Error(data.error || 'Test email failed')
      alert('✅ Test email sent! Check your inbox.')
    } catch (e) { console.error(e); alert('Could not send test email. Double-check SMTP secrets in Supabase.') } finally { setTesting(false) }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Shelter Dashboard</h2>
        <button onClick={sendTestEmail} disabled={testing} className="bg-emerald-600 text-white rounded px-3 py-1 text-sm">{testing ? 'Sending…' : 'Send Test Email'}</button>
      </div>

      <div className="grid gap-4">
        {dogs.map(d => (
          <div key={d.id} className="border rounded p-4 bg-white">
            <div className="flex justify-between items-center">
              <div className="font-semibold">{d.name}</div>
              <div className="text-sm text-gray-600">Inquiries: {counts[d.id] || 0}</div>
            </div>
            <div className="mt-2 flex gap-3 text-sm">
              <Link to={`/dog/${d.id}`} className="text-blue-600">View</Link>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mt-8 mb-2">All Inquiries</h3>
      <div className="space-y-3">
        {inquiries.map(q => (
          <div key={q.id} className="border rounded p-3 bg-white text-sm">
            <div><b>Dog ID:</b> {q.dog_id}</div>
            <div><b>From:</b> {q.adopter_name} &lt;{q.adopter_email}&gt;</div>
            <div className="mt-1 whitespace-pre-wrap">{q.message}</div>
            <div className="text-gray-500 mt-1">{new Date(q.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
