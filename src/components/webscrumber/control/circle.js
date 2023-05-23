import { AppContext } from "../../../context/webscrumber.context"
import { useContext, useRef, useState, useEffect } from "react"

export default function CircleToolsHandle({ children }) {
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
        if (context.tool === "circle" && isDrawing !== null) {
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
                    [`graphic${context.index.graphic}`]: {
                        ...graphicContext,
                        borderRadius: "50%",
                    },
                },
            }))
        }
    }, [width, height, left, top, isDrawing, setContext, context])

    useEffect(() => {
        const circle = (e) => {
            e.preventDefault()
            e.stopImmediatePropagation()
            setIsDrawing(true)
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
                    if (dx > 0) {
                        setWidth(`${dx}px`)
                    } else {
                        setLeft(`${mousePoint.current.x + dx}px`)
                        setWidth(`${-dx}px`)
                    }

                    if (dy > 0) {
                        setHeight(`${dy}px`)
                    } else {
                        setHeight(`${-dy}px`)
                        setTop(`${dy + mousePoint.current.y}px`)
                    }
                }

                const mouseup = (e) => {
                    e.stopPropagation()
                    setIsDrawing(false)
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

                window.addEventListener("mouseup", mouseup)
                window.addEventListener("keydown", keydown)
            }

            mousePoint.current = { x: e.clientX, y: e.clientY }
            setLeft(`${mousePoint.current.x}px`)
            setTop(`${mousePoint.current.y}px`)
            setWidth(0)
            setHeight(0)
            window.addEventListener("mousemove", mousemove)
        }

        if (context.ref.canvas) {
            if (context.tool === "circle") {
                document.body.style.cursor = "crosshair"
                context.ref.canvas.addEventListener("mousedown", circle)
            } else {
                document.body.removeAttribute("style")
                context.ref.canvas.removeEventListener("mousedown", circle)
            }
        }
        return () => {
            context.ref.canvas.removeEventListener("mousedown", circle)
        }
    }, [context.tool, context.ref.canvas, context.index, setContext])
    return <>{children}</>
}
