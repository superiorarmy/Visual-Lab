import Graphic from "../../graphic"
import { useContext, useEffect, useMemo, useState } from "react"
import { AppContext } from "@/context/webscrumber.context"
import TempGroupSelector from "./selector"

export default function TempGroup({
    tempGroup,
    setTempGroup,
    theChildren,
    setTheChildren,
    name,
    ...props
}) {
    const { context } = useContext(AppContext)
    const [max, setMax] = useState(undefined)
    const [min, setMin] = useState(undefined)
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

    const [width, setWidth] = useState()
    const [height, setHeight] = useState()
    const [left, setLeft] = useState()
    const [top, setTop] = useState()
    useEffect(() => {
        if (max && min) {
            setWidth(max.left - min.left + max.width)
            setHeight(max.top - min.top + max.height)
            setLeft(min.left)
            setTop(min.top)
        }
    }, [max, min])

    useEffect(() => {
        if (width && height && left && top) {
            if (
                !tempGroup.hasOwnProperty("width") &&
                !tempGroup.hasOwnProperty("height") &&
                !tempGroup.hasOwnProperty("left") &&
                !tempGroup.hasOwnProperty("top") &&
                context.layer.tempGroup
            ) {
                const tempGroupChildren = context.layer.tempGroup.children
                Object.keys(tempGroupChildren).forEach((child) => {
                    const childLeft = `${
                        parseInt(tempGroupChildren[child].left, 10) - left
                    }px`
                    const childTop = `${
                        parseInt(tempGroupChildren[child].top, 10) - top
                    }px`
                    setTheChildren((prev) => ({
                        ...prev,
                        [child]: {
                            ...tempGroupChildren[child],
                            left: childLeft,
                            top: childTop,
                        },
                    }))
                })
            }

            if (
                tempGroup.width !== width &&
                tempGroup.height !== height &&
                tempGroup.left !== left &&
                tempGroup.top !== top
            ) {
                setTempGroup((prev) => ({ ...prev, width, height, left, top }))
            }
        }
    }, [
        width,
        height,
        left,
        top,
        tempGroup,
        setTempGroup,
        setTheChildren,
        context.layer.tempGroup,
    ])

    const elements = context.activeList.map((name) => (
        <Graphic
            key={name}
            name={name}
            style={theChildren?.[name]}
            {...props}
        />
    ))
    return (
        <TempGroupSelector
            width={width}
            height={height}
            top={top}
            left={left}
            setWidth={setWidth}
            setHeight={setHeight}
            setLeft={setLeft}
            setTop={setTop}
        >
            {elements}
        </TempGroupSelector>
    )
}
