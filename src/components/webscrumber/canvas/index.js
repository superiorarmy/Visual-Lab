import { useContext, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { AppContext } from "../../../context/webscrumber.context"
import Graphic from "../element/graphic"
import deepEqual from "deep-equal"
import TempGroup from "../element/group/temp"

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
    const [tempGroup, setTempGroup] = useState({ children: {} })
    useEffect(() => {
        if (context.activeList.length >= 2) {
            context.activeList.forEach((active) => {
                if (context.layer[active]) {
                    setTempGroup((prev) => ({
                        ...prev,
                        children: {
                            ...prev.children,
                            [active]: context.layer[active],
                        },
                    }))
                }
            })
        } else if (context.layer?.tempGroup && !context.activeList.length) {
            setContext((prev) => {
                const clonedLayers = { ...prev.layer }
                const { tempGroup: lastTemp, ...modifiedLayers } = clonedLayers
                Object.entries(lastTemp.children).forEach(([keys, values]) => {
                    modifiedLayers[keys] = values
                    modifiedLayers[keys].isActive = false
                })
                console.log(modifiedLayers)

                return { ...prev, layer: modifiedLayers }
            })
        }
    }, [context.activeList, context.layer, setContext])
    useEffect(() => {
        if (
            Object.keys(tempGroup.children).length ===
                context.activeList.length &&
            Object.keys(tempGroup.children).length &&
            context.activeList.length
        ) {
            setContext((prev) => {
                const excludedLayers = { ...prev.layer }
                Object.keys(tempGroup.children).forEach((active) => {
                    if (excludedLayers[active]) {
                        delete excludedLayers[active]
                    }
                })

                return { ...prev, layer: { ...excludedLayers, tempGroup } }
            })
        }
    }, [tempGroup, context.activeList, setContext])

    // useEffect(() => {
    //     if (context.layer) {
    //         if (context.activeList.length >= 2) {
    //             context.activeList.forEach((active) => {
    //                 if (context.layer[active]) {
    //                     setTempGroup((prev) => ({
    //                         ...prev,
    //                         children: {
    //                             ...prev.children,
    //                             [active]: context.layer[active],
    //                         },
    //                     }))
    //                 }
    //             })

    //             if (
    //                 !context.layer.tempGroup ||
    //                 !deepEqual(context.layer.tempGroup, tempGroup)
    //             ) {
    //                 setContext((prev) => {
    //                     // create a copy of the layer object
    //                     let newLayer = { ...prev.layer }
    //                     // remove keys present in tempGroup from layer
    //                     Object.keys(tempGroup.children || {}).forEach((key) => {
    //                         if (newLayer[key]) {
    //                             delete newLayer[key]
    //                         }
    //                     })
    //                     // update the tempGroup key in layer
    //                     newLayer.tempGroup = tempGroup
    //                     return {
    //                         ...prev,
    //                         layer: newLayer,
    //                     }
    //                 })
    //             }
    //         } else if (!context.activeList.length && context.layer.tempGroup) {
    //             setTempGroup({})
    //             const { tempGroup, ...newState } = context.layer
    //             if (context.layer !== newState) {
    //                 setContext((prev) => {
    //                     // create a copy of the layer object
    //                     let newLayer = { ...prev.layer }
    //                     // remove keys present in tempGroup from layer
    //                     Object.keys(prev.layer.tempGroup.children).forEach(
    //                         (key) => {
    //                             if (key !== "isActive") {
    //                                 const newObj = {
    //                                     ...newLayer.tempGroup.children[key],
    //                                     isActive: false,
    //                                 }
    //                                 newLayer[key] = newObj
    //                             }
    //                         }
    //                     )
    //                     // remove the tempGroup key from layer
    //                     delete newLayer.tempGroup
    //                     return { ...prev, layer: newLayer }
    //                 })
    //             }
    //         }
    //     }
    // }, [context.layer, context.activeList, tempGroup, setContext])

    const RenderElement = ({ name, ...props }) => {
        const [theChildren, setTheChildren] = useState()
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
                        theChildren={theChildren}
                        setTheChildren={setTheChildren}
                        tempGroup={tempGroup}
                        setTempGroup={setTempGroup}
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
