import Graphic from "../../graphic"
import { useContext, useEffect, useMemo, useState } from "react"
import { AppContext } from "@/context/webscrumber.context"
import TempGroupSelector from "./selector"

export default function TempGroup({
    tempGroup,
    setTempGroup,
    childrenStyle,
    setChildrenStyle,
    ...props
}) {
    const { context } = useContext(AppContext)
    const [max, setMax] = useState(undefined)
    const [min, setMin] = useState(undefined)
    // detect max and min (closest and farthest elements)
    useEffect(() => {
        if (
            context.layer &&
            context.layer.tempGroup &&
            context.activeList.length > 1
        ) {
            const result = Object.values(
                context.layer.tempGroup.children
            ).reduce(
                (acc, graphic) => {
                    const left = parseInt(graphic.left, 10)
                    const top = parseInt(graphic.top, 10)
                    const width = parseInt(graphic.width, 10)
                    const height = parseInt(graphic.height, 10)

                    if (left > acc.max.left) {
                        acc.max.left = left
                        acc.max.width = width
                    }
                    if (top > acc.max.top) {
                        acc.max.top = top
                        acc.max.height = height
                    }
                    if (left < acc.min.left) {
                        acc.min.left = left
                        acc.min.width = width
                    }
                    if (top < acc.min.top) {
                        acc.min.top = top
                        acc.min.height = height
                    }

                    return acc
                },
                {
                    max: { left: -Infinity, top: -Infinity },
                    min: { left: Infinity, top: Infinity },
                }
            )
            setMax(result.max)
            setMin(result.min)
        }
    }, [context.layer, context.activeList])

    // adjust children style, width, height, left and top
    useEffect(() => {
        if (
            max &&
            min &&
            !tempGroup.width &&
            !tempGroup.height &&
            !tempGroup.left &&
            !tempGroup.top &&
            Object.keys(tempGroup).length === 1
        ) {
            const width = max.left - min.left + max.width
            const height = max.top - min.top + max.height
            const left = min.left
            const top = min.top

            setTempGroup((prev) => {
                let children = {}
                Object.keys(tempGroup.children).forEach((child) => {
                    const childLeft = parseInt(
                        tempGroup.children[child].left,
                        10
                    )
                    const childTop = parseInt(tempGroup.children[child].top, 10)
                    const adjustedChildLeft = `${childLeft - left}px`
                    const adjustedChildTop = `${childTop - top}px`
                    children = {
                        ...children,
                        [child]: {
                            ...prev.children[child],
                            left: adjustedChildLeft,
                            top: adjustedChildTop,
                        },
                    }
                })

                return { ...prev, children, width, height, left, top }
            })
        }
    }, [max, min, tempGroup, setTempGroup])

    const elements = context.activeList.map((name) => (
        <Graphic
            key={name}
            name={name}
            style={tempGroup.children[name]}
            {...props}
        />
    ))
    return (
        <TempGroupSelector tempGroup={tempGroup} setTempGroup={setTempGroup}>
            {elements}
        </TempGroupSelector>
    )
}
