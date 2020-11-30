import React from 'react';

export default ({ title, year, id }) => {
  const openURL = (id) => {
    const base = 'https://openlibrary.org';
    let url = `${base}${id}`;
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  return (
    <div key={title} className="book">
      <div className="book-icon">::</div>
      <div className="book-body">
        <p className="book-title">{title}</p>
        <p className="book-year">{year}</p>
      </div>
      <div className="book-icon" onClick={() => openURL(id)}>
        &#10159;
      </div>
    </div>
  );
};
