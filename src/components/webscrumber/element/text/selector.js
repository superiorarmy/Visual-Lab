import styled from "styled-components"
import Point from "./points"
import { useContext, useRef, useState, useEffect, useCallback } from "react"
import { AppContext } from "@/context/webscrumber.context"

export default function Selector({ name, elementRef }) {
    const points = [
        "top-left",
        "top",
        "top-right",
        "right",
        "bottom-right",
        "bottom",
        "bottom-left",
        "left",
    ]

    // Mover
    const { context, setContext } = useContext(AppContext)
    const [isClickPoint, setIsClickPoint] = useState(false)
    const [isMoving, setIsMoving] = useState(false)
    const initialPosition = useRef(null)
    const element = context?.layer?.[name]
    const setElement = useCallback(
        (value) => {
            setContext((prev) => ({
                ...prev,
                layer: {
                    ...prev.layer,
                    [name]: { ...prev.layer[name], ...value },
                },
            }))
        },
        [name, setContext]
    )
    useEffect(() => {
        const mousedown = (e) => {
            e.preventDefault()
            e.stopImmediatePropagation()

            initialPosition.current = { x: element?.left, y: element?.top }

            const mousePoint = {
                x: e.clientX - parseInt(element?.left?.split("px")[0]),
                y: e.clientY - parseInt(element?.top?.split("px")[0]),
            }

            const mousemove = (e) => {
                setIsMoving(true)
                const dx = e.clientX - mousePoint.x
                const dy = e.clientY - mousePoint.y
                setElement({ left: `${dx}px`, top: `${dy}px` })
            }

            const mouseup = () => {
                setIsMoving(false)
                window.removeEventListener("mousemove", mousemove)
                window.removeEventListener("mouseup", mouseup)
            }

            if (!isClickPoint) {
                window.addEventListener("mousemove", mousemove)
                window.addEventListener("mouseup", mouseup)
            } else {
                window.removeEventListener("mousemove", mousemove)
                window.removeEventListener("mouseup", mouseup)
            }
        }

        if (element?.isActive && elementRef && context.tool === "pointer") {
            elementRef.addEventListener("mousedown", mousedown)
        }

        return () => {
            if (elementRef) {
                elementRef.removeEventListener("mousedown", mousedown)
                window.removeEventListener("mousemove", mousedown)
                window.removeEventListener("mouseup", mousedown)
            }
        }
    }, [element, elementRef, setElement, isClickPoint, context.tool])

    // Shortkey
    useEffect(() => {
        const onMovingKeyDown = (e) => {
            if (e.key === "Escape") {
                setElement({
                    x: initialPosition.current.x,
                    y: initialPosition.current.y,
                    isActive: false,
                })
            } else if (e.key === "Alt") {
                console.log("duplicate by dragging element")
            }
        }

        const onKeyDown = (e) => {
            if (element?.isActive) {
                if (e.key === "Delete" || e.key === "Backspace") {
                    console.log("delete element")
                    setContext((prev) => {
                        const newLayer = { ...prev.layer }
                        delete newLayer[name]
                        return { ...prev, layer: newLayer }
                    })
                } else if ((e.ctrlKey || e.metaKey) && e.key === "c") {
                    setContext((prev) => ({
                        ...prev,
                        clipboard: { ...element },
                    }))
                }
            }

            if ((e.ctrlKey || e.metaKey) && e.key === "v") {
                console.log("paste element")
            }
        }

        if (isMoving) {
            window.addEventListener("keydown", onMovingKeyDown)
        } else {
            window.addEventListener("keydown", onKeyDown)
        }

        return () => {
            // clean up the event listener on component unmount
            window.removeEventListener("keydown", onMovingKeyDown)
            window.removeEventListener("keydown", onKeyDown)
        }
    }, [element, isMoving, context.layer, setElement, name, setContext])

    return (
        <Outline>
            {points.map((point) => (
                <Point
                    key={`element-${point}`}
                    name={name}
                    point={point}
                    setIsClickPoint={setIsClickPoint}
                />
            ))}
        </Outline>
    )
}

const Outline = styled.div`
    width: 100%;
    height: 100%;
    border: 1px solid blue;
    z-index: 2;
`
