import { useCallback, useContext, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { AppContext } from "../../../context/webscrumber.context"
import Graphic from "../element/graphic"
import deepEqual from "deep-equal"
import TempGroup from "../element/group/temp"
import useTempGroup from "../element/group/temp/handle"

const Canvas = () => {
    const ref = useRef()
    const { context, setContext } = useContext(AppContext)
    useEffect(() => {
        setContext((prev) => {
            return {
                ...prev,
                ref: {
                    ...prev.ref,
                    canvas: ref.current,
                },
            }
        })
    }, [setContext])

    const [elements, setElements] = useState([])
    useEffect(() => {
        if (context.layer) {
            const elementNames = Object.keys(context.layer)
            setElements(elementNames)
        }
    }, [context.layer])

    // handle TempGroup
    const [tempGroup, setTempGroup] = useTempGroup()

    const [childrenStyle, setChildrenStyle] = useState({})
    const RenderElement = ({ name, ...props }) => {
        if (context.layer && context.layer[name]) {
            if (context.layer[name].type === "graphic") {
                return (
                    <Graphic
                        name={name}
                        style={context.layer[name]}
                        {...props}
                    />
                )
            } else if (context.layer.tempGroup?.children) {
                return (
                    <TempGroup
                        childrenStyle={childrenStyle}
                        setChildrenStyle={setChildrenStyle}
                        tempGroup={tempGroup}
                        setTempGroup={setTempGroup}
                        {...props}
                    />
                )
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
