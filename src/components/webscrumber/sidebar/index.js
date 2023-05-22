import styled from "styled-components"
import { FaMousePointer, FaPenFancy } from "react-icons/fa"
import { MdOutlineTextFields } from "react-icons/md"
import { BsCircle, BsSquare, BsStars } from "react-icons/bs"
import { GoFileMedia } from "react-icons/go"
import Icon from "./icon"

const Sidebar = () => {
    const icons = [
        {
            icon: FaMousePointer,
            name: "pointer",
        },
        {
            icon: BsCircle,
            name: "circle",
        },
        {
            icon: BsSquare,
            name: "square",
        },
        {
            icon: GoFileMedia,
            name: "media",
        },
        {
            icon: BsStars,
            name: "stars",
        },
        {
            icon: FaPenFancy,
            name: "pen",
        },
        {
            icon: MdOutlineTextFields,
            name: "text",
        },
    ]
    return (
        <SidebarContainer>
            <IconsContainer>
                {icons.map((icon) => {
                    return <Icon icon={icon} key={icon.name} />
                })}
            </IconsContainer>
        </SidebarContainer>
    )
}

export default Sidebar

const SidebarContainer = styled.div`
    width: 50px;
    height: 100%;
    background: #191919;
    position: absolute;
    left: 0;
    z-index: 1000000000;
`

const IconsContainer = styled.ul`
    list-style: none;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
`
