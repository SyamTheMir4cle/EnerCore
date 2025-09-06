import React from 'react';

function PlaceholderPage({ title }) {
  return (
    <div className="p-8 h-full flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
      <p className="mt-4 text-lg text-gray-600">
        Ini adalah konten untuk halaman {title}. Fungsionalitas penuh akan diimplementasikan di sini.
      </p>
    </div>
  );
}

export default PlaceholderPage;