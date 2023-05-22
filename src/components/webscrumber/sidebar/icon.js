import styled from "styled-components"

const { AppContext } = require("../../../context/webscrumber.context")
const { useContext, useEffect, useState } = require("react")

const Icon = ({ icon, ...props }) => {
    const IconJSX = icon.icon
    const [isActive, setIsActive] = useState(false)
    const { context, setContext } = useContext(AppContext)
    const onClick = (e) => {
        setContext((prev) => ({
            ...prev,
            tool: e.target.closest("li").getAttribute("mode"),
        }))
    }

    useEffect(() => {
        if (icon.name === context.tool) {
            setIsActive(true)
        } else {
            setIsActive(false)
        }
    }, [icon.name, context])

    return (
        <IconContainer {...props} mode={icon.name} onClick={onClick}>
            <IconJSX {...(isActive && { className: "active" })} />
        </IconContainer>
    )
}

export default Icon

const IconContainer = styled.li`
    width: 100%;
    padding: 5px 0;
    display: flex;
    justify-content: center;
    background: transparent;
    transition: 0.35s ease-out;

    &:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    svg {
        margin: 15px 0;
        fill: #fff;
        transition: 0.4s ease-out;

        &.active {
            fill: #14a6db;
        }

        &:hover {
            fill: #14a6db;
            cursor: pointer;
        }
    }
`
