import { AppContext } from "@/context/webscrumber.context"
import { useContext, useEffect, useRef } from "react"
import styled from "styled-components"

export default function MediaMenu() {
    const { setContext } = useContext(AppContext)
    const ref = useRef(null)
    useEffect(() => {
        setContext((prev) => ({
            ...prev,
            ref: { ...prev.ref, mediaMenu: ref.current },
        }))
    }, [setContext])
    return <StyledMediaMenu ref={ref}>Media Menu</StyledMediaMenu>
}

const StyledMediaMenu = styled.div`
    position: absolute;
    width: 200px;
    height: 100%;
    background-color: white;
`
