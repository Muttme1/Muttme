export default function FAQ(){
  const Q = ({q,a}) => (
    <div className="mb-4">
      <div className="font-semibold">{q}</div>
      <div className="text-gray-700">{a}</div>
    </div>
  )
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-extrabold mb-4">FAQ</h2>
      <Q q="Is MuttMe free?" a="Yes. Shelters can list dogs for free." />
      <Q q="How do inquiries work?" a="Your message is emailed to the shelter and logged in our system." />
      <Q q="Do you support cats?" a="Dog-first for now; multi-species is planned." />
    </div>
  )
}
