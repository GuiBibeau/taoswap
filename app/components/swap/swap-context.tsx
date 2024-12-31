"use client"

import { createContext, useContext, useState } from "react"

export const SwapContext = createContext({})

export const useSwapContext = () => useContext(SwapContext)

export const SwapContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState({})
  return <SwapContext.Provider value={{ state, setState }}>{children}</SwapContext.Provider>
}
