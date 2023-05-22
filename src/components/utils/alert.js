const { default: styled } = require("styled-components")

export const Alert = styled.div`
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 50px;
    background: #222;
    color: #eee;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    font-size: 20px;
`
