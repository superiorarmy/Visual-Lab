import styled, { css } from "styled-components"
import Input from "../../utils/input"
import { useEffect, useRef, useState } from "react"
import { IoMdDownload } from "react-icons/io"
import {
    BsFillArrowLeftCircleFill,
    BsFillCloudCheckFill,
    BsFillCloudFill,
} from "react-icons/bs"
import File from "./file"

const Header = () => {
    const [trigger, setTrigger] = useState(false)
    const [isFocusing, setIsFocusing] = useState(false)
    const onMouseEnter = () => setTrigger(true)
    const onMouseLeave = () => {
        if (isFocusing) {
            setTrigger(true)
        } else {
            setTrigger(false)
        }
    }
    const onFocus = () => setIsFocusing(true)
    const onBlur = () => {
        setIsFocusing(false)
        setTrigger(false)
    }

    const fileContextMenu = useRef(null)
    const [openMenu, setOpenMenu] = useState(false)
    const onOpenMenu = () => setOpenMenu(true)

    useEffect(() => {
        const click = (e) => {
            if (fileContextMenu.current) {
                if (!fileContextMenu.current.contains(e.target)) {
                    setOpenMenu(false)
                }
            }
        }

        if (openMenu) {
            window.addEventListener("click", click)
        } else {
            window.removeEventListener("click", click)
        }
    }, [openMenu])

    const [isSaved, setIsSaved] = useState(false)
    return (
        <HeaderContainer
            trigger={trigger}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <Content justify={"start"}>
                <BsFillArrowLeftCircleFill />
                <HorizontalLine />
                <Menu onClick={onOpenMenu}>File</Menu>
                {openMenu && <File ref={fileContextMenu} />}
            </Content>

            <Content justify={"center"}>
                {isSaved ? (
                    <BsFillCloudCheckFill
                        onClick={() => setIsSaved((prev) => !prev)}
                    />
                ) : (
                    <BsFillCloudFill
                        onClick={() => setIsSaved((prev) => !prev)}
                    />
                )}
                <Input
                    onFocus={onFocus}
                    onBlurProps={onBlur}
                    name='projectName'
                    textAlign={"center"}
                    initialValue='Untitled'
                />
            </Content>

            <Content justify={"end"}>
                <Button>
                    <IoMdDownload />
                    <span>Download</span>
                </Button>
            </Content>
        </HeaderContainer>
    )
}

export default Header

const HeaderContainer = styled.div`
    height: 50px;
    width: 100%;
    padding: 0 16px;
    position: relative;
    transition: 0.4s ease-out;
    background: ${({ trigger }) => (trigger ? "#1a1c5c" : "#020d50")};
    z-index: 1000000000;
    user-select: none;
`

const Content = styled.div`
    width: calc(100% - 35px);
    height: 100%;
    position: absolute;
    top: 0;
    display: flex;
    justify-content: ${({ justify }) => justify};
    align-items: center;

    input {
        z-index: 1;
    }

    svg {
        fill: #fff;
        height: 16px;
        width: auto;
        margin-right: 10px;
        transition: 0.4s ease-out;
        z-index: 1;

        ${({ justify }) =>
            justify === "start" &&
            css`
                &:hover {
                    fill: #14a6db;
                    cursor: pointer;
                }
            `}
    }
`

const HorizontalLine = styled.div`
    width: 1px;
    height: 50%;
    background: #fff;
    opacity: 50%;
    margin-right: 13px;
    margin-left: 6px;
`

const Menu = styled.span`
    color: #fff;
    font-size: 16px;
    transition: 0.4s ease-out;
    z-index: 1;

    &:hover {
        color: #14a6db;
        cursor: pointer;
    }
`

const Button = styled.div`
    padding: 10px 15px;
    display: flex;
    align-items: center;
    color: white;
    background: rgba(255, 255, 255, 0.1);
    transition: 0.4s ease-out;

    &:hover {
        cursor: pointer;
        background: rgba(255, 255, 255, 0.2);
    }
`
