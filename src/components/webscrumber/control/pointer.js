import { AppContext } from "@/context/webscrumber.context"
import deepEqual from "deep-equal"
import { useContext, useEffect, useRef, useState } from "react"
import Selection from "../element/selection"

export default function PointerToolsHandle({ children }) {
    const { context, setContext } = useContext(AppContext)
    const [selection, setSelection] = useState({})
    const [activeList, setActiveList] = useState([])
    const select = useRef({})
    // drag selection
    useEffect(() => {
        const mousedown = (e) => {
            e.preventDefault()
            e.stopImmediatePropagation()
            select.current = {
                width: 0,
                height: 0,
                left: e.clientX,
                top: e.clientY,
            }
            setSelection(select.current)
            setActiveList([])
            setContext((prev) => {
                const name = e.target.getAttribute("name")
                if (name) {
                    return { ...prev, activeList: [name] }
                } else {
                    return { ...prev, activeList: [] }
                }
            })

            const mousemove = (e) => {
                const dx = e.clientX - select.current.left
                const dy = e.clientY - select.current.top

                if (dx > 6) {
                    setSelection((prev) => ({ ...prev, width: dx }))
                } else if (dx < -6) {
                    setSelection((prev) => ({
                        ...prev,
                        left: select.current.left + dx,
                        width: -dx,
                    }))
                }

                if (dy > 6) {
                    setSelection((prev) => ({ ...prev, height: dy }))
                } else if (dy < -6) {
                    setSelection((prev) => ({
                        ...prev,
                        top: select.current.top + dy,
                        height: -dy,
                    }))
                }
            }

            const mouseup = () => {
                setSelection({})
                window.removeEventListener("mousemove", mousemove)
                window.removeEventListener("mouseup", mouseup)
            }

            window.addEventListener("mousemove", mousemove)
            window.addEventListener("mouseup", mouseup)
        }

        if (context.ref && context.ref.canvas) {
            context.ref.canvas.addEventListener("mousedown", mousedown)
        }
        return () => {
            if (context.ref && context.ref.canvas) {
                context.ref.canvas.removeEventListener("mousedown", mousedown)
            }
        }
    }, [context.ref, setContext])

    useEffect(() => {
        setContext((prev) => {
            if (!Object.keys(selection).length) {
                const { selection, ...previous } = { ...prev }
                return previous
            } else {
                return { ...prev, selection }
            }
        })
    }, [selection, setContext])

    const selecting = useRef(false)
    const [isSelection, setIsSelection] = useState(false)
    useEffect(() => {
        if (context && context.selection && !selecting.current) {
            selecting.current = true
            setIsSelection(true)
        } else if (context && !context.selection && selecting.current) {
            selecting.current = false
            setIsSelection(false)
        }
    }, [context])

    return (
        <>
            {isSelection && (
                <Selection
                    activeList={activeList}
                    setActiveList={setActiveList}
                />
            )}
            {children}
        </>
    )
}
