import React, { useState, useRef, useCallback } from 'react';
import useBookSearch from './hooks/useBookSearch';
import Book from './components/book';
import './styles.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const handleSearch = (e) => {
    const query = e.target.value;
    setQuery(query);
    setPageNo(1);
  };

  const { loading, error, books, hasMore } = useBookSearch(query, pageNo);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNo((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="App">
      <div className="text-center">
        <h3>Open library Books finder</h3>
        <input
          value={query}
          defaultValue="programmer"
          onChange={handleSearch}
          placeholder={'programmer'}
        />
      </div>
      {loading && <center>Loading..</center>}
      {error && 'Error...'}
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return (
            <div ref={lastBookElementRef} key={book.title} className="book">
              <Book title={book.title} year={book.publish_year} id={book.key} />
            </div>
          );
        } else {
          return (
            <Book title={book.title} year={book.publish_year} id={book.key} />
          );
        }
      })}
    </div>
  );
}
