import { AppContext } from "../../../../context/webscrumber.context"
import { useCallback, useContext, useEffect, useRef } from "react"
import styled, { css } from "styled-components"

const Point = ({ name, point, setIsClickPoint, ...props }) => {
    const ref = useRef(null)
    const { context, setContext } = useContext(AppContext)
    const setGraphic = useCallback(
        (value) =>
            setContext((prev) => ({
                ...prev,
                layer: {
                    ...prev.layer,
                    [name]: {
                        ...prev.layer[name],
                        ...value,
                    },
                },
            })),
        [name, setContext]
    )

    const mousePoint = useRef(null)

    useEffect(() => {
        const reference = ref.current
        const graphic = context.layer[name]
        const setIsResizing = (bool) =>
            setContext((prev) => ({
                ...prev,
                layer: {
                    ...prev.layer,
                    [name]: {
                        ...prev.layer[name],
                        status: {
                            isDrawing: false,
                            isResizing: bool,
                            isMoving: false,
                        },
                    },
                },
            }))
        const mousedown = (e) => {
            e.preventDefault()
            setIsClickPoint(true)
            setIsResizing(true)
            mousePoint.current = { x: e.clientX, y: e.clientY }
            const pointName = e.target.getAttribute("direction")

            const mousemove = (e) => {
                const parseGraphicValue = (value) =>
                    parseInt(graphic?.[value].split("px")[0])
                if (pointName === "top-right") {
                    setGraphic({
                        width: `${
                            parseGraphicValue("width") +
                            (e.clientX - mousePoint.current.x)
                        }px`,
                        top: `${
                            parseGraphicValue("top") -
                            (mousePoint.current.y - e.clientY)
                        }px`,
                        height: `${
                            parseGraphicValue("height") -
                            (e.clientY - mousePoint.current.y)
                        }px`,
                    })
                } else if (pointName === "right") {
                    setGraphic({
                        width: `${
                            parseGraphicValue("width") +
                            (e.clientX - mousePoint.current.x)
                        }px`,
                    })
                } else if (pointName === "bottom-right") {
                    setGraphic({
                        width: `${
                            parseGraphicValue("width") +
                            (e.clientX - mousePoint.current.x)
                        }px`,
                        height: `${
                            parseGraphicValue("height") +
                            (e.clientY - mousePoint.current.y)
                        }px`,
                    })
                } else if (pointName === "bottom") {
                    setGraphic({
                        height: `${
                            parseGraphicValue("height") +
                            (e.clientY - mousePoint.current.y)
                        }px`,
                    })
                } else if (pointName === "bottom-left") {
                    setGraphic({
                        left: `${
                            parseGraphicValue("left") -
                            (mousePoint.current.x - e.clientX)
                        }px`,
                        width: `${
                            parseGraphicValue("width") -
                            (e.clientX - mousePoint.current.x)
                        }px`,
                        height: `${
                            parseGraphicValue("height") +
                            (e.clientY - mousePoint.current.y)
                        }px`,
                    })
                } else if (pointName === "left") {
                    setGraphic({
                        left: `${
                            parseGraphicValue("left") -
                            (mousePoint.current.x - e.clientX)
                        }px`,
                        width: `${
                            parseGraphicValue("width") -
                            (e.clientX - mousePoint.current.x)
                        }px`,
                    })
                } else if (pointName === "top-left") {
                    setGraphic({
                        left: `${
                            parseGraphicValue("left") -
                            (mousePoint.current.x - e.clientX)
                        }px`,
                        width: `${
                            parseGraphicValue("width") -
                            (e.clientX - mousePoint.current.x)
                        }px`,
                        top: `${
                            parseGraphicValue("top") -
                            (mousePoint.current.y - e.clientY)
                        }px`,
                        height: `${
                            parseGraphicValue("height") -
                            (e.clientY - mousePoint.current.y)
                        }px`,
                    })
                } else if (pointName === "top") {
                    setGraphic({
                        top: `${
                            parseGraphicValue("top") -
                            (mousePoint.current.y - e.clientY)
                        }px`,
                        height: `${
                            parseGraphicValue("height") -
                            (e.clientY - mousePoint.current.y)
                        }px`,
                    })
                }
            }
            const mouseup = () => {
                setIsClickPoint(false)
                setIsResizing(false)
                window.removeEventListener("mousemove", mousemove)
                window.removeEventListener("mouseup", mouseup)
            }

            mousePoint.current = { x: e.clientX, y: e.clientY }
            window.addEventListener("mousemove", mousemove)
            window.addEventListener("mouseup", mouseup)
        }
        if (ref && reference) {
            reference.addEventListener("mousedown", mousedown)
        } else {
            reference.removeEventListener("mousedown", mousedown)
        }

        return () => reference.removeEventListener("mousedown", mousedown)
    }, [context.layer, name, setGraphic, setIsClickPoint, setContext])
    return <StyledPoint {...props} ref={ref} direction={point} point={point} />
}

export default Point

const StyledPoint = styled.div.attrs(({ direction }) => ({ point: direction }))`
    width: 5px;
    height: 5px;
    position: absolute;
    background-color: white;

    ${({ point }) => {
        if (point === "top-left") {
            return css`
                top: -3.5px;
                left: -3.5px;
                cursor: nw-resize;
            `
        } else if (point === "top") {
            return css`
                top: -3.5px;
                left: calc(50% - 3.5px);
                cursor: n-resize;
            `
        } else if (point === "top-right") {
            return css`
                top: -3.5px;
                right: -3.5px;
                cursor: ne-resize;
            `
        } else if (point === "right") {
            return css`
                top: calc(50% - 3.5px);
                right: -3.5px;
                cursor: e-resize;
            `
        } else if (point === "bottom-right") {
            return css`
                bottom: -3.5px;
                right: -3.5px;
                cursor: se-resize;
            `
        } else if (point === "bottom") {
            return css`
                bottom: -3.5px;
                right: calc(50% - 3.5px);
                cursor: s-resize;
            `
        } else if (point === "bottom-left") {
            return css`
                bottom: -3.5px;
                left: -3.5px;
                cursor: sw-resize;
            `
        } else if (point === "left") {
            return css`
                left: -3.5px;
                top: calc(50% - 3.5px);
                cursor: w-resize;
            `
        }
    }}
`
