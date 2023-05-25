import styled from "styled-components"
import Graphic from ".."
import { useContext, useEffect, useState } from "react"
import { AppContext } from "@/context/webscrumber.context"

export default function TempGroup({
    tempGroup,
    setTempGroup,
    clickedNames,
    setClickedNames,
    name,
    ...props
}) {
    const { context } = useContext(AppContext)
    const [max, setMax] = useState(undefined)
    const [min, setMin] = useState(undefined)
    useEffect(() => {
        if (context.layer && context.layer.tempGroup) {
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
    }, [context.layer, clickedNames])

    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const [left, setLeft] = useState(0)
    const [top, setTop] = useState(0)
    useEffect(() => {
        if (max && min) {
            setWidth(max.left - min.left + max.width)
            setHeight(max.top - min.top + max.height)
            setLeft(min.left)
            setTop(min.top)
        }
    }, [max, min])

    const [childrenStyle, setChildrenStyle] = useState({})
    useEffect(() => {
        if (width && height && left && top) {
            const {
                children,
                left: selectorLeft,
                top: selectorTop,
            } = context.layer.tempGroup
            const newChildrenStyle = { ...childrenStyle } // create a copy to avoid direct mutation

            Object.keys(children).forEach((name) => {
                const newLeft = parseInt(children[name].left, 10) - selectorLeft
                const newTop = parseInt(children[name].top, 10) - selectorTop

                if (
                    !newChildrenStyle[name] ||
                    newChildrenStyle[name].left !== newLeft ||
                    newChildrenStyle[name].top !== newTop
                ) {
                    newChildrenStyle[name] = {
                        ...children[name],
                        left: newLeft,
                        top: newTop,
                    }
                    setChildrenStyle(newChildrenStyle)
                }
            })

            const newValue = { width, height, left, top }
            if (
                tempGroup.width !== newValue.width &&
                tempGroup.height !== newValue.height &&
                tempGroup.left !== newValue.left &&
                tempGroup.top !== newValue.top
            )
                setTempGroup((prev) => ({ ...prev, ...newValue }))
        }
        // eslint-disable-next-line
    }, [width, height, left, top, setTempGroup])

    const elements = clickedNames.map((name) => (
        <Graphic
            key={name}
            name={name}
            style={childrenStyle[name]}
            setClickedNames={setClickedNames}
            {...props}
        />
    ))
    return (
        <TempGroupSelector width={width} height={height} top={top} left={left}>
            {elements}
        </TempGroupSelector>
    )
}

const TempGroupSelector = styled.div.attrs(({ width, height, top, left }) => ({
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
