import { AppContext } from "@/context/webscrumber.context"
import { useContext, useEffect } from "react"

export default function MediaToolsHandle({ children }) {
    const { context, setContext } = useContext(AppContext)
    useEffect(() => {
        if (context.ref.mediaMenu && context.tool === "media") {
        }
    }, [context.tool, context.ref.mediaMenu])
    return <>{children}</>
}
