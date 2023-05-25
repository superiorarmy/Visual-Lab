import { useContext, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { AppContext } from "../../../context/webscrumber.context"
import Graphic from "../element/graphic"
import deepEqual from "deep-equal"
import TempGroup from "../element/graphic/group/temp"

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

    const [clickedNames, setClickedNames] = useState([])
    const [tempGroup, setTempGroup] = useState({ children: {} })
    useEffect(() => {
        if (context.layer) {
            if (clickedNames.length >= 2) {
                clickedNames.forEach((clickedName) => {
                    if (context.layer[clickedName]) {
                        setTempGroup((prev) => ({
                            ...prev,
                            children: {
                                ...prev.children,
                                [clickedName]: context.layer[clickedName],
                            },
                        }))
                    }
                })

                if (
                    !context.layer.tempGroup ||
                    !deepEqual(context.layer.tempGroup, tempGroup)
                ) {
                    setContext((prev) => {
                        // create a copy of the layer object
                        let newLayer = { ...prev.layer }
                        // remove keys present in tempGroup from layer
                        Object.keys(tempGroup.children || {}).forEach((key) => {
                            if (newLayer[key]) {
                                delete newLayer[key]
                            }
                        })
                        // update the tempGroup key in layer
                        newLayer.tempGroup = tempGroup
                        return {
                            ...prev,
                            layer: newLayer,
                        }
                    })
                }
            } else if (!clickedNames.length && context.layer.tempGroup) {
                setTempGroup({})
                const { tempGroup, ...newState } = context.layer
                if (context.layer !== newState) {
                    setContext((prev) => {
                        // create a copy of the layer object
                        let newLayer = { ...prev.layer }
                        // remove keys present in tempGroup from layer
                        Object.keys(prev.layer.tempGroup.children).forEach(
                            (key) => {
                                if (key !== "isActive") {
                                    const newObj = {
                                        ...newLayer.tempGroup.children[key],
                                        isActive: false,
                                    }
                                    newLayer[key] = newObj
                                }
                            }
                        )
                        // remove the tempGroup key from layer
                        delete newLayer.tempGroup
                        return { ...prev, layer: newLayer }
                    })
                }
            }
        }
    }, [context.layer, clickedNames, tempGroup, setContext])

    const RenderElement = ({ name, ...props }) => {
        if (context.layer && context.layer[name]) {
            if (context.layer[name].type === "graphic") {
                return (
                    <Graphic
                        setClickedNames={setClickedNames}
                        name={name}
                        style={context.layer[name]}
                        {...props}
                    />
                )
            } else if (context.layer.tempGroup?.children) {
                return (
                    <TempGroup
                        tempGroup={tempGroup}
                        setTempGroup={setTempGroup}
                        clickedNames={clickedNames}
                        setClickedNames={setClickedNames}
                        name={name}
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
