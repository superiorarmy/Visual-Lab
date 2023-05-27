import { AppContext } from "@/context/webscrumber.context"
import { useContext, useEffect, useRef } from "react"
import styled from "styled-components"

export default function TempGroupSelector({
    width,
    height,
    left,
    top,
    setWidth,
    setHeight,
    setLeft,
    setTop,
    children,
}) {
    const ref = useRef(null)
    const mousePoint = useRef({})
    const { context } = useContext(AppContext)
    useEffect(() => {
        const selector = ref.current
        const mousedown = (e) => {
            e.preventDefault()
            e.stopImmediatePropagation()
            const name = e.target.getAttribute("name")
            if (
                context.layer.tempGroup &&
                context.layer.tempGroup.children.hasOwnProperty(name)
            ) {
                mousePoint.current = {
                    x: e.clientX - context.layer.tempGroup.left,
                    y: e.clientY - context.layer.tempGroup.top,
                }

                const mousemove = (e) => {
                    const dx = e.clientX - mousePoint.current.x
                    const dy = e.clientY - mousePoint.current.y

                    setLeft(dx)
                    setTop(dy)
                }

                const mouseup = (e) => {
                    e.stopImmediatePropagation()
                    window.removeEventListener("mousemove", mousemove)
                    window.removeEventListener("mouseup", mouseup)
                }

                window.addEventListener("mousemove", mousemove)
                window.addEventListener("mouseup", mouseup)
            }
        }

        selector.addEventListener("mousedown", mousedown)

        return () => selector.removeEventListener("mousedown", mousedown)
    }, [context.layer.tempGroup, setLeft, setTop])
    return (
        <TempSelector
            ref={ref}
            width={width}
            height={height}
            left={left}
            top={top}
        >
            {children}
        </TempSelector>
    )
}

const TempSelector = styled.div.attrs(({ width, height, top, left }) => ({
    style: {
        width: `${width}px`,
        height: `${height}px`,
        top: `${top}px`,
        left: `${left}px`,
    },
}))`
    position: absolute;
    border: 1px solid blue;
`
