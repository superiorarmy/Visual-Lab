import { AppContext } from "../../../context/webscrumber.context"
import { useContext, useRef, useState, useEffect } from "react"

export default function SquareToolsHandle({ children }) {
    const { context, setContext } = useContext(AppContext)
    const [left, setLeft] = useState(null)
    const [top, setTop] = useState(null)
    const [width, setWidth] = useState(null)
    const [height, setHeight] = useState(null)
    const mousePoint = useRef({})

    useEffect(() => {
        const graphicContext = {
            position: "absolute",
            left,
            top,
            width,
            height,
            backgroundColor: "#e33",
            zIndex: context.index.graphic + context.index.text,
            type: "graphic",
        }

        setContext((prev) => ({
            ...prev,
            layer: {
                ...prev.layer,
                [`graphic${context.index.graphic}`]: graphicContext,
            },
        }))
    }, [width, height, left, top, setContext, context.index])

    useEffect(() => {
        const square = (e) => {
            e.preventDefault()
            e.stopImmediatePropagation()
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

                const mouseup = () => {
                    mousePoint.current = {}
                    window.removeEventListener("mousemove", mousemove)
                    window.removeEventListener("mouseup", mouseup)
                    window.removeEventListener("keydown", keydown)
                }

                const keydown = (e) => {
                    setStatus("release")
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
            window.addEventListener("mousemove", mousemove)
        }

        if (context.canvas) {
            if (context.tool === "square") {
                document.body.style.cursor = "crosshair"
                context.canvas.addEventListener("mousedown", square)
            } else {
                document.body.removeAttribute("style")
                context.canvas.removeEventListener("mousedown", square)
            }
        }
        return () => {
            context.canvas.removeEventListener("mousedown", square)
        }
    }, [context.tool, context.canvas, context.index, setContext])
    return <>{children}</>
}
