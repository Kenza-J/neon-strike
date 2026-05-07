export default function Contact() {
  return (
    <div className="p-10 space-y-6">
      <form className="space-y-4">
        <input required placeholder="Nom" className="block p-2 text-black" />
        <input required type="email" placeholder="Email" className="block p-2 text-black" />
        <textarea required placeholder="Message" className="block p-2 text-black"></textarea>
        <button className="bg-purple-600 px-4 py-2 rounded">
          Envoyer
        </button>
      </form>

      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18..."
        width="100%"
        height="300"
      ></iframe>
    </div>
  );
}