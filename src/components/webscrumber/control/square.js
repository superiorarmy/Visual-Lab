import { AppContext } from "../../../context/webscrumber.context"
import { useContext, useRef, useState, useEffect } from "react"

export default function SquareToolsHandle({ children }) {
    const { context, setContext } = useContext(AppContext)
    const initialState = (value) =>
        context?.layer?.[`graphic${context?.index?.graphic}`]
            ? context?.layer?.[`graphic${context?.index?.graphic}`]?.[value]
            : null
    const [left, setLeft] = useState(initialState("left"))
    const [top, setTop] = useState(initialState("top"))
    const [width, setWidth] = useState(initialState("width"))
    const [height, setHeight] = useState(initialState("height"))
    const [isDrawing, setIsDrawing] = useState(null)
    const mousePoint = useRef({})

    useEffect(() => {
        if (context.tool === "square" && isDrawing !== null) {
            const graphicContext = {
                position: "absolute",
                left,
                top,
                width,
                height,
                backgroundColor: "#e33",
                zIndex: context.index.graphic + context.index.text,
                status: { isDrawing },
                type: "graphic",
            }

            setContext((prev) => ({
                ...prev,
                layer: {
                    ...prev.layer,
                    [`graphic${context.index.graphic}`]: graphicContext,
                },
            }))
        }
    }, [
        width,
        height,
        left,
        top,
        isDrawing,
        setContext,
        context.tool,
        context.index,
    ])

    // handle mouse dragging
    const drag = useRef({})
    useEffect(() => {
        const square = (e) => {
            e.preventDefault()
            e.stopImmediatePropagation()
            setIsDrawing(true)

            // handle double click
            if (e.detail === 2) {
                const name = e.target.getAttribute("name")
                if (name) {
                    setContext((prev) => ({
                        ...prev,
                        tool: "pointer",
                        layer: {
                            ...prev.layer,
                            [name]: { ...prev.layer[name], isActive: true },
                        },
                    }))
                }
            }
            drag.current = { x: e.clientX, y: e.clientY }
            setContext((prev) => {
                return {
                    ...prev,
                    index: {
                        ...prev.index,
                        graphic: prev.index.graphic + 1,
                    },
                }
            })

            const mousemove = (e) => {
                e.stopImmediatePropagation()
                console.log(e.clientX, mousePoint.current.x)
                const dx = e.clientX - mousePoint.current.x
                const dy = e.clientY - mousePoint.current.y

                if (e.shiftKey) {
                    const length = Math.max(Math.abs(dx), Math.abs(dy))
                    if (dx > 0 && dy > 0) {
                        setLeft(`${mousePoint.current.x}px`)
                        setTop(`${mousePoint.current.y}px`)
                        setWidth(`${length}px`)
                        setHeight(`${length}px`)
                    } else if (dx < 0 && dy > 0) {
                        setLeft(`${mousePoint.current.x - length}px`)
                        setTop(`${mousePoint.current.y}px`)
                        setWidth(`${length}px`)
                        setHeight(`${length}px`)
                    } else if (dx > 0 && dy < 0) {
                        setLeft(`${mousePoint.current.x}px`)
                        setTop(`${mousePoint.current.y - length}px`)
                        setWidth(`${length}px`)
                        setHeight(`${length}px`)
                    } else {
                        setLeft(`${mousePoint.current.x - length}px`)
                        setTop(`${mousePoint.current.y - length}px`)
                        setWidth(`${length}px`)
                        setHeight(`${length}px`)
                    }
                } else {
                    if (dx > 6) {
                        setWidth(`${dx}px`)
                    } else if (dx < -6) {
                        setLeft(`${mousePoint.current.x + dx}px`)
                        setWidth(`${-dx}px`)
                    }

                    if (dy > 6) {
                        setHeight(`${dy}px`)
                    } else if (dy < -6) {
                        setHeight(`${-dy}px`)
                        setTop(`${dy + mousePoint.current.y}px`)
                    }
                }
            }

            const mouseup = (e) => {
                e.stopImmediatePropagation()
                // have drag?
                if (
                    Math.abs(drag.current.x - e.clientX > 6) ||
                    Math.abs(drag.current.y - e.clientY) > 6
                ) {
                    setIsDrawing(false)
                }
                window.removeEventListener("mousemove", mousemove)
                window.removeEventListener("mouseup", mouseup)
                window.removeEventListener("keydown", keydown)
            }

            const keydown = (e) => {
                if (e.key === "Escape") {
                    setContext((prev) => {
                        return {
                            ...prev,
                            index: {
                                ...prev.index,
                                graphic: prev.index.graphic - 1,
                            },
                        }
                    })
                    window.removeEventListener("mousemove", mousemove)
                    window.removeEventListener("mouseup", mouseup)
                    window.removeEventListener("keydown", keydown)
                }
            }

            window.addEventListener("keydown", keydown)

            mousePoint.current = { x: e.clientX, y: e.clientY }
            setLeft(`${mousePoint.current.x}px`)
            setTop(`${mousePoint.current.y}px`)
            setWidth(0)
            setHeight(0)
            window.addEventListener("mousemove", mousemove)
            window.addEventListener("mouseup", mouseup)
        }

        if (context.ref && context.ref.canvas) {
            if (context.tool === "square") {
                document.body.style.cursor = "crosshair"
                context.ref.canvas.addEventListener("mousedown", square)
            } else {
                document.body.removeAttribute("style")
                context.ref.canvas.removeEventListener("mousedown", square)
            }
        }
        return () => {
            if (context.ref && context.ref.canvas) {
                context.ref.canvas.removeEventListener("mousedown", square)
            }
        }
    }, [context.tool, context.ref, context.index, setContext])

    return <>{children}</>
}
