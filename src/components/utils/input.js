import { AppContext } from "../../context/webscrumber.context"
import { useContext, useEffect, useState } from "react"
import styled, { css } from "styled-components"

const Input = ({
    name,
    type = "text",
    placeholder = "",
    initialValue = "",
    onBlurProps = () => {},
    ...props
}) => {
    const [state, setState] = useState(initialValue)
    const { setContext } = useContext(AppContext)
    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            e.target.blur()
        } else if (e.key === "Escape") {
            e.target.value = state
        }
    }
    const onBlur = (e) => {
        if (e.target.value) {
            setState(e.target.value)
        } else {
            e.target.value = state
        }
        onBlurProps()
    }

    useEffect(() => {
        setContext((prev) => ({ ...prev, [name]: state }))
    }, [state, name, setContext])
    return (
        <AppInput
            {...props}
            type={type}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            defaultValue={state}
            {...(placeholder && { placeholder })}
        />
    )
}

const AppInput = styled.input`
    width: 100px;
    border: 0;
    padding-bottom: 4px;
    border-bottom: 1px solid #fff;
    background: transparent;
    color: #fff;
    caret-color: aqua;
    font-size: 14px;
    transition: 0.4s ease-out;
    ${({ textAlign }) =>
        textAlign &&
        css`
            text-align: ${textAlign};
        `}

    &:hover {
        border-bottom: 1px solid aqua;
        cursor: pointer;
    }

    &:focus,
    :focus-within {
        outline: 0;
        border-bottom: 1px solid aqua;
        cursor: text;
    }
`

export default Input
