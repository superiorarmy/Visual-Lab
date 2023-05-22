import Canvas from "../components/webscrumber/canvas"
import Header from "../components/webscrumber/header"
import Sidebar from "../components/webscrumber/sidebar"
import AppContextProvider, { AppContext } from "../context/webscrumber.context"
import styled from "styled-components"
import ToolsControl from "../components/webscrumber/control/tools"
import { useContext, useState } from "react"

export default function WebScrumber() {
    return (
        <AppContextProvider>
            <ToolsControl>
                <AppPage>
                    <Header />
                    <Sidebar />
                    <Canvas />
                </AppPage>
            </ToolsControl>
        </AppContextProvider>
    )
}

const AppPage = styled.section`
    width: 100vw;
    height: 100vh;
    background-color: #020212;
`
