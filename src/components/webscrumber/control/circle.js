import { AppContext } from "../../../context/webscrumber.context"
import { useContext, useRef, useState, useEffect } from "react"

export default function CircleToolsHandle({ children }) {
    const { context, setContext } = useContext(AppContext)
    const [left, setLeft] = useState(null)
    const [top, setTop] = useState(null)
    const [width, setWidth] = useState(null)
    const [height, setHeight] = useState(null)
    const [status, setStatus] = useState("")
    const mousePoint = useRef({})

    useEffect(() => {
        const elementContext = {
            position: "absolute",
            left,
            top,
            width,
            height,
            backgroundColor: "#e33",
            borderRadius: "50%",
            zIndex: context.elementIndex,
            type: "element",
        }

        if (status === "holding" || status === "moving") {
            setContext((prev) => ({
                ...prev,
                layer: {
                    ...prev.layer,
                    [`element${context.elementIndex}`]: elementContext,
                },
            }))
        } else if (status === "release") {
            setContext((prev) => ({
                ...prev,
                layer: {
                    ...prev.layer,
                    [`element${context.elementIndex}`]: elementContext,
                },
            }))
        }
        // eslint-disable-next-line
    }, [width, height, context.elementIndex])

    useEffect(() => {
        const circle = (e) => {
            e.preventDefault()
            e.stopImmediatePropagation()
            setContext((prev) => ({
                ...prev,
                elementIndex: prev.elementIndex + 1,
            }))

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
                        setHeight(`${dy}px`)
                        setTop(`${dy + mousePoint.current.y}px`)
                    }
                }

                const mouseup = () => {
                    setStatus("release")
                    window.removeEventListener("mousemove", mousemove)
                    window.removeEventListener("mouseup", mouseup)
                    window.removeEventListener("keydown", keydown)
                }

                const keydown = (e) => {
                    if (e.key === "Escape") {
                        // Do whatever you want when ESC is pressed, e.g., stop drawing
                        setContext((prev) => ({
                            ...prev,
                            elementIndex: prev.elementIndex - 1,
                        }))
                        window.removeEventListener("mousemove", mousemove)
                        window.removeEventListener("mouseup", mouseup)
                        window.removeEventListener("keydown", keydown)
                        // If you have more cleanup to do when ESC is pressed, put it here
                    }
                }

                setStatus("moving")
                window.addEventListener("mouseup", mouseup)
                window.addEventListener("keydown", keydown)
            }

            setStatus("holding")
            mousePoint.current = { x: e.clientX, y: e.clientY }
            setLeft(`${mousePoint.current.x}px`)
            setTop(`${mousePoint.current.y}px`)
            window.addEventListener("mousemove", mousemove)
        }

        if (context.canvas) {
            if (context.tool === "circle") {
                document.body.style.cursor = "crosshair"
                context.canvas.addEventListener("mousedown", circle)
            } else {
                document.body.removeAttribute("style")
                context.canvas.removeEventListener("mousedown", circle)
            }
        }
        return () => {
            context.canvas.removeEventListener("mousedown", circle)
        }
    }, [context.tool, context.canvas, setContext])
    return <>{children}</>
}
