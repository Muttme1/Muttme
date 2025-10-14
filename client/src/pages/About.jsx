export default function About(){
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-extrabold">About MuttMe</h2>
      <p className="mt-3 text-gray-700">
        MuttMe helps rescues showcase adoptable dogs with a swipeable experience.
        Every match nudges a pup closer to a home.
      </p>
      <h3 className="text-xl font-bold mt-6">How it works</h3>
      <ol className="list-decimal ml-6 text-gray-700 space-y-1">
        <li>Swipe through adoptable dogs from partner shelters.</li>
        <li>Tap “Meet” to learn about a dog.</li>
        <li>Send an inquiry—shelters get notified instantly.</li>
      </ol>
    </div>
  )
}
