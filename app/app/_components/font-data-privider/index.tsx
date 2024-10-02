"use client";

import { type ReactNode, createContext, useContext } from "react";

type FontData = {
  style: {
    fontFamily: string;
  };
};

type Context = {
  font?: FontData;
};

const defaultContext: Context = {};

const context = createContext(defaultContext);

export function useFontDataContext() {
  return useContext(context);
}

export function FontDataContextProvider({
  children,
  fontData,
}: {
  children?: ReactNode;
  fontData: FontData;
}) {
  return (
    <context.Provider
      value={{
        font: fontData,
      }}>
      {children}
    </context.Provider>
  );
}
