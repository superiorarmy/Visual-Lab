import { useState } from "react"
import styled from "styled-components"

export default function Text() {
    const [input, setInput] = useState("Lorem Ipsum")
    return <div>{input}</div>
}
