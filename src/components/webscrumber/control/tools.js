import { AppContext } from "../../../context/webscrumber.context"
import React, { useContext, useEffect, useRef, useState } from "react"
import SquareToolsHandle from "./square"
import PointerToolsHandle from "./pointer"
import CircleToolsHandle from "./circle"
import TextToolsHandle from "./text"
import MediaToolsHandle from "./media"

export default function ToolsControl({ children }) {
    const { context, setContext } = useContext(AppContext)
    const [toolType, setToolType] = useState(null)

    // Set tool
    useEffect(() => {
        if (toolType === null && !context.tool) {
            setContext((prev) => ({
                ...prev,
                index: {
                    graphic: 0,
                    text: 0,
                },
                tool: "pointer",
            }))
            setToolType("pointer")
        } else {
            setToolType(context.tool)
        }
    }, [context.tool, setContext, toolType])

    // Tool change and set active to all elements to false
    useEffect(() => {
        if (context.layer && context.tool !== "pointer") {
            const names = Object.keys(context.layer)
            names.forEach((name) => {
                if (context.layer[name].isActive) {
                    setContext((prev) => ({
                        ...prev,
                        layer: {
                            ...prev.layer,
                            [name]: {
                                ...prev.layer[name],
                                isActive: false,
                            },
                        },
                    }))
                }
            })
        }
        return () => {}
    }, [context.tool, context.layer, setContext])

    let tool = null
    switch (toolType) {
        case "pointer":
            tool = <PointerToolsHandle>{children}</PointerToolsHandle>
            break
        case "circle":
            tool = <CircleToolsHandle>{children}</CircleToolsHandle>
            break
        case "square":
            tool = <SquareToolsHandle>{children}</SquareToolsHandle>
            break
        case "text":
            tool = <TextToolsHandle>{children}</TextToolsHandle>
            break
        case "media":
            tool = <MediaToolsHandle>{children}</MediaToolsHandle>
            break
        default:
            tool = null
    }

    return <>{tool}</>
}
