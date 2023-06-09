import { AppContext } from "@/context/webscrumber.context"
import { useContext, useEffect } from "react"

export default function TextToolsHandle({ children }) {
    const { context, setContext } = useContext(AppContext)
    useEffect(() => {
        if (context.ref.canvas) {
            const click = (e) => {
                setContext((prev) => ({
                    ...prev,
                    index: {
                        ...prev.index,
                        text: prev.index.text + 1,
                    },
                    tool: "pointer",
                    layer: {
                        ...prev.layer,
                        [`text${context.index.text + 1}`]: {
                            position: "absolute",
                            left: `${e.clientX}px`,
                            top: `${e.clientY}px`,
                            width: "150px",
                            height: "20px",
                            isActive: true,
                            fontSize: "18px",
                            color: "#fff",
                            type: "text",
                        },
                    },
                }))
            }

            if (context.tool === "text") {
                document.body.style.cursor = "text"
                context.ref.canvas.addEventListener("click", click)
            } else {
                document.body.removeAttribute("style")
                context.ref.canvas.removeEventListener("click", click)
            }
        }
    }, [
        context.tool,
        context.ref.canvas,
        context.elementIndex,
        context.index,
        setContext,
    ])
    return <>{children}</>
}
