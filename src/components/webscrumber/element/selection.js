import { AppContext } from "@/context/webscrumber.context"
import { useContext, useEffect, useState } from "react"
import styled from "styled-components"

export default function Selection({ activeList, setActiveList }) {
    const { context, setContext } = useContext(AppContext)
    const [selection, setSelection] = useState({
        width: 0,
        height: 0,
        left: 0,
        top: 0,
    })
    useEffect(() => {
        if (context.selection) {
            setSelection(context.selection)
        } else {
            setSelection({ width: 0, height: 0, left: 0, top: 0 })
        }
    }, [context.selection])

    useEffect(() => {
        let activeSet = new Set(activeList)
        if (context.layer && context.selection) {
            Object.entries(context.layer).forEach(([keys, values]) => {
                if (keys !== "tempGroup") {
                    const elementBox = {
                        left: parseInt(values.left, 10),
                        top: parseInt(values.top, 10),
                        right:
                            parseInt(values.left, 10) +
                            parseInt(values.width, 10),
                        bottom:
                            parseInt(values.top, 10) +
                            parseInt(values.height, 10),
                    }
                    const selectionBox = {
                        left: context.selection.left,
                        top: context.selection.top,
                        right: context.selection.left + context.selection.width,
                        bottom:
                            context.selection.top + context.selection.height,
                    }
                    console.log(selectionBox, elementBox)
                    if (
                        ((selectionBox.left >= selectionBox.right + 6 ||
                            selectionBox.left <= selectionBox.right - 6) &&
                            // bottom-right
                            selectionBox.right >= elementBox.left &&
                            selectionBox.bottom >= elementBox.top) ||
                        // top-right
                        (selectionBox.right >= elementBox.left &&
                            selectionBox.right <= elementBox.right &&
                            selectionBox.top <= elementBox.bottom &&
                            selectionBox.top >= elementBox.top)
                    ) {
                        activeSet.add(keys)
                    }
                }
            })
            setActiveList([...activeSet])
        }
        // eslint-disable-next-line
    }, [context.selection, context.layer, context.activeList, setContext])

    useEffect(() => {
        setContext((prev) => {
            if (activeList.length !== prev.activeList.length) {
                return { ...prev, activeList }
            }
            return prev
        })
    }, [activeList, setContext])
    return (
        <Selector
            width={selection.width}
            height={selection.height}
            left={selection.left}
            top={selection.top}
        />
    )
}

const Selector = styled.div.attrs(({ width, height, left, top }) => ({
    style: {
        width: `${width}px`,
        height: `${height}px`,
        left: `${left}px`,
        top: `${top}px`,
    },
}))`
    position: absolute;
    z-index: 999999999;
    background: rgba(250, 250, 250, 0.25);
`
