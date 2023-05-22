import styled from "styled-components"
import Point from "./points"
import { useContext, useRef, useState, useEffect, useCallback } from "react"
import { AppContext } from "@/context/webscrumber.context"

export default function Selector({ name, graphicRef }) {
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
    const graphic = context?.layer?.[name]
    const setGraphic = useCallback(
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

            initialPosition.current = { x: graphic?.left, y: graphic?.top }

            const mousePoint = {
                x: e.clientX - parseInt(graphic?.left?.split("px")[0]),
                y: e.clientY - parseInt(graphic?.top?.split("px")[0]),
            }

            const mousemove = (e) => {
                setIsMoving(true)
                const dx = e.clientX - mousePoint.x
                const dy = e.clientY - mousePoint.y
                setGraphic({ left: `${dx}px`, top: `${dy}px` })
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

        if (graphic?.isActive && graphicRef && context.tool === "pointer") {
            graphicRef.addEventListener("mousedown", mousedown)
        }

        return () => {
            if (graphicRef) {
                graphicRef.removeEventListener("mousedown", mousedown)
                window.removeEventListener("mousemove", mousedown)
                window.removeEventListener("mouseup", mousedown)
            }
        }
    }, [graphic, graphicRef, setGraphic, isClickPoint, context.tool])

    // Shortkey
    useEffect(() => {
        const onMovingKeyDown = (e) => {
            if (e.key === "Escape") {
                setGraphic({
                    x: initialPosition.current.x,
                    y: initialPosition.current.y,
                    isActive: false,
                })
            } else if (e.key === "Alt") {
                console.log("duplicate by dragging graphic")
            }
        }

        const onKeyDown = (e) => {
            if (graphic?.isActive) {
                if (e.key === "Delete" || e.key === "Backspace") {
                    context.setElementIndex((prev) => prev - 1)
                    setContext((prev) => {
                        const newLayer = { ...prev.layer }
                        delete newLayer[name]
                        return { ...prev, layer: newLayer }
                    })
                } else if ((e.ctrlKey || e.metaKey) && e.key === "c") {
                    setContext((prev) => ({
                        ...prev,
                        clipboard: { ...graphic },
                    }))
                }
            }

            if ((e.ctrlKey || e.metaKey) && e.key === "v") {
                console.log("paste graphic")
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
    }, [graphic, isMoving, context.layer, setGraphic, name, setContext])

    return (
        <Outline>
            {points.map((point) => (
                <Point
                    key={`graphic-${point}`}
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
