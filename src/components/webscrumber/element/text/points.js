import { AppContext } from "../../../../context/webscrumber.context"
import { useCallback, useContext, useEffect, useRef } from "react"
import styled, { css } from "styled-components"

const Point = ({ name, point, setIsClickPoint, ...props }) => {
    const ref = useRef(null)
    const { context, setContext } = useContext(AppContext)
    const setElement = useCallback(
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
        const element = context.layer[name]
        const mousedown = (e) => {
            setIsClickPoint(true)
            mousePoint.current = { x: e.clientX, y: e.clientY }
            const pointName = e.target.getAttribute("direction")

            const mousemove = (e) => {
                const parseElementValue = (value) =>
                    parseInt(element?.[value].split("px")[0])
                if (pointName === "top-right") {
                    setElement({
                        width: `${
                            parseElementValue("width") +
                            (e.clientX - mousePoint.current.x)
                        }px`,
                        top: `${
                            parseElementValue("top") -
                            (mousePoint.current.y - e.clientY)
                        }px`,
                        height: `${
                            parseElementValue("height") -
                            (e.clientY - mousePoint.current.y)
                        }px`,
                    })
                } else if (pointName === "right") {
                    setElement({
                        width: `${
                            parseElementValue("width") +
                            (e.clientX - mousePoint.current.x)
                        }px`,
                    })
                } else if (pointName === "bottom-right") {
                    setElement({
                        width: `${
                            parseElementValue("width") +
                            (e.clientX - mousePoint.current.x)
                        }px`,
                        height: `${
                            parseElementValue("height") +
                            (e.clientY - mousePoint.current.y)
                        }px`,
                    })
                } else if (pointName === "bottom") {
                    setElement({
                        height: `${
                            parseElementValue("height") +
                            (e.clientY - mousePoint.current.y)
                        }px`,
                    })
                } else if (pointName === "bottom-left") {
                    setElement({
                        left: `${
                            parseElementValue("left") -
                            (mousePoint.current.x - e.clientX)
                        }px`,
                        width: `${
                            parseElementValue("width") -
                            (e.clientX - mousePoint.current.x)
                        }px`,
                        height: `${
                            parseElementValue("height") +
                            (e.clientY - mousePoint.current.y)
                        }px`,
                    })
                } else if (pointName === "left") {
                    setElement({
                        left: `${
                            parseElementValue("left") -
                            (mousePoint.current.x - e.clientX)
                        }px`,
                        width: `${
                            parseElementValue("width") -
                            (e.clientX - mousePoint.current.x)
                        }px`,
                    })
                } else if (pointName === "top-left") {
                    setElement({
                        left: `${
                            parseElementValue("left") -
                            (mousePoint.current.x - e.clientX)
                        }px`,
                        width: `${
                            parseElementValue("width") -
                            (e.clientX - mousePoint.current.x)
                        }px`,
                        top: `${
                            parseElementValue("top") -
                            (mousePoint.current.y - e.clientY)
                        }px`,
                        height: `${
                            parseElementValue("height") -
                            (e.clientY - mousePoint.current.y)
                        }px`,
                    })
                } else if (pointName === "top") {
                    setElement({
                        top: `${
                            parseElementValue("top") -
                            (mousePoint.current.y - e.clientY)
                        }px`,
                        height: `${
                            parseElementValue("height") -
                            (e.clientY - mousePoint.current.y)
                        }px`,
                    })
                }
            }
            const mouseup = () => {
                setIsClickPoint(false)
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
    }, [context.layer, name, setElement, setIsClickPoint])
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
