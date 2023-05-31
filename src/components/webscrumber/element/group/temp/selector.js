import { useEffect, useRef } from "react"
import styled from "styled-components"

export default function TempGroupSelector({
    tempGroup,
    setTempGroup,
    children,
}) {
    const ref = useRef(null)
    const mousePoint = useRef({})

    useEffect(() => {
        const selector = ref.current
        const mousedown = (e) => {
            e.preventDefault()
            e.stopImmediatePropagation()
            const name = e.target.getAttribute("name")
            if (tempGroup.children.hasOwnProperty(name)) {
                mousePoint.current = {
                    x: e.clientX - tempGroup.left,
                    y: e.clientY - tempGroup.top,
                }

                const mousemove = (e) => {
                    const dx = e.clientX - mousePoint.current.x
                    const dy = e.clientY - mousePoint.current.y
                    setTempGroup((prev) => ({ ...prev, left: dx, top: dy }))
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
    }, [tempGroup, setTempGroup])

    return (
        <TempSelector
            ref={ref}
            width={tempGroup.width}
            height={tempGroup.height}
            left={tempGroup.left}
            top={tempGroup.top}
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
