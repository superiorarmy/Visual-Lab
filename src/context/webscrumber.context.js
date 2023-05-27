import Error from "next/error"
import { useEffect, useState, createContext } from "react"

export const AppContext = createContext(null)

export default function AppContextProvider({ children }) {
    const [context, setContext] = useState({ activeList: [] })

    useEffect(() => {
        console.log(context)
        document.title = `${context.projectName} Design`
    }, [context])
    return (
        <AppContext.Provider value={{ context, setContext }}>
            {children}
        </AppContext.Provider>
    )
}
