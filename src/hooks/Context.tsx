import React, { createContext, useContext, useState, ReactNode } from "react";
import { IGeneralData } from "../types/invoice-types";

const DataContext = createContext<any>(null);

export const useDataContext = () => {
  return useContext(DataContext);
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState<IGeneralData>({});

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};
