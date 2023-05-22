import { forwardRef } from "react"
import styled from "styled-components"

const File = forwardRef((props, ref) => {
    const menus = ["Save", "Save as"]
    return (
        <FileContextMenu ref={ref}>
            {menus.map((menu) => (
                <Item key={`menu-${menu}`}>{menu}</Item>
            ))}
        </FileContextMenu>
    )
})

File.displayName = "File"

export default File

const FileContextMenu = styled.ul`
    position: absolute;
    bottom: -10px;
    width: 100px;
    height: 100px;
    background: #eee2ee;
`

const Item = styled.li`
    width: 100%;
    height: 10px;
    font-size: 18px;
    color: #020202;
    background: transparent;
`
