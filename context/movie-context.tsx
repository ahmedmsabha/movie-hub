import React, { createContext, useState, useContext } from "react";

const MovieContext = createContext<{
  page: number;
  incrementPage: () => void;
}>({
  page: 1,
  incrementPage: () => {},
});

export const MovieProvider = ({ children }: { children: React.ReactNode }) => {
  const [page, setPage] = useState(1);

  const incrementPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <MovieContext.Provider value={{ page, incrementPage }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMoviePage = () => useContext(MovieContext);
