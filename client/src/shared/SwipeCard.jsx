
import React, { useRef, useState } from 'react'
import { supabase } from '../supabase'

export default function SwipeCard({ dog, user }){
  const ref = useRef()
  const [offset, setOffset] = useState({x:0,y:0})
  const [gone, setGone] = useState(false)

  const onDown = (e) => { ref.current.setPointerCapture(e.pointerId); ref.current.startX = e.clientX }
  const onMove = (e) => { if(ref.current && ref.current.startX){ const dx = e.clientX - ref.current.startX; setOffset({x:dx,y:0}) } }
  const onUp = async (e) => {
    if(ref.current && ref.current.startX){
      const dx = e.clientX - ref.current.startX; ref.current.startX = null
      if(dx > 120){
        setGone(true)
        if(!user){ alert('Please sign in to save your Soul Matches ❤️'); return }
        try { await supabase.from('likes').insert({ user_id: user.uid, dog_id: dog.id }); alert('❤️ Soul Match!\n\nView more info to learn about ' + dog.name) }
        catch(e){ console.error(e); alert('Could not save like.') }
      } else { setOffset({x:0,y:0}) }
    }
  }

  if(gone) return null

  return (
   <div
  ref={ref}
  className="absolute left-0 right-0 mx-auto w-[360px] card p-4 touch-none select-none hover:-translate-y-0.5 hover:shadow-xl transition"
  style={{ transform:`translateX(${offset.x}px) translateY(${offset.y}px)` }}
  onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}
>
      <div className="h-72 rounded-md overflow-hidden bg-gray-200">
        <img src={dog.img} alt={dog.name} className="w-full h-full object-cover"/>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">{dog.name} <span className="text-sm text-gray-500">· {dog.age}</span></h3>
          <p className="text-sm text-gray-600">{dog.breed}</p>
          <div className="flex gap-2 text-xs mt-1">
            {dog.good_with_kids && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">👧 Kids</span>}
            {dog.good_with_dogs && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">🐶 Dogs</span>}
            {dog.good_with_cats && <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">🐱 Cats</span>}
            {dog.energy_level && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded">⚡ {dog.energy_level}</span>}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <a href={'/dog/' + dog.id} className="px-3 py-1 rounded bg-teal-600 text-white text-sm">View More Info</a>
        </div>
      </div>
    </div>
  )
}
