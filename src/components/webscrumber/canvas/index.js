import { useContext, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { AppContext } from "../../../context/webscrumber.context"
import Graphic from "../element/graphic"

const Canvas = () => {
    const ref = useRef()
    const { context, setContext } = useContext(AppContext)
    useEffect(() => {
        setContext((prev) => {
            return { ...prev, canvas: ref.current }
        })
    }, [ref, setContext])
    const [elements, setElements] = useState([])
    useEffect(() => {
        if (context.layer) {
            const elementNames = Object.keys(context.layer)
            setElements(elementNames)
        }
    }, [context.layer])

    const RenderElement = ({ name }) => {
        if (context.layer[name]) {
            if (context.layer[name].type === "graphic") {
            }
        }
    }

    return (
        <StyledCanvas onMouseDown={(e) => e.preventDefault()} ref={ref}>
            {elements.map((name) => {
                return <RenderElement key={name} name={name} />
            })}
        </StyledCanvas>
    )
}

Canvas.displayName = "Canvas"

const StyledCanvas = styled.section`
    width: 100%;
    height: 100%;
`

export default Canvas
