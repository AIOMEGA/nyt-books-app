import { useRef } from 'react';
import BookCard from './BookCard.jsx';

export default function CategoryRow({ title, books, userId, token }) {
  const containerRef = useRef(null);

  const scroll = (dir) => {
    const el = containerRef.current;
    if (!el) return;
    const amount = el.clientWidth;
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold ml-8">{title}</h2>
      <div className="relative">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-900/70 rounded-full text-white hover:bg-gray-900"
        >
          &#8249;
        </button>
        <div
          ref={containerRef}
          className="flex overflow-x-auto gap-4 px-8 snap-x snap-mandatory scroll-smooth scrollbar-hide"
        >
          {books.map((book) => (
            <div key={book.primary_isbn13} className="snap-start shrink-0 w-72">
              <BookCard book={book} userId={userId} token={token} />
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-900/70 rounded-full text-white hover:bg-gray-900"
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}