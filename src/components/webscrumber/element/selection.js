import { AppContext } from "@/context/webscrumber.context"
import { useContext, useEffect, useState } from "react"
import styled from "styled-components"

export default function Selection() {
    const { context } = useContext(AppContext)
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
