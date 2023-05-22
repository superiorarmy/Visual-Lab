import { AppContext } from "../../../../context/webscrumber.context"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import css from "styled-jsx/css"
import Point from "./points"
import Selector from "./selector"

export default function Graphic({ name }) {
    const ref = useRef(null)
    const { context, setContext } = useContext(AppContext)
    const graphic = context?.layer?.[name]
    const setGraphic = useCallback(
        (value) => {
            setContext((prev) => ({
                ...prev,
                layer: {
                    ...prev.layer,
                    [name]: { ...prev.layer[name], ...value },
                },
            }))
        },
        [name, setContext]
    )

    const onClick = (e) => {
        if (
            context.tool === "pointer" &&
            e.target.getAttribute("name") === name
        ) {
            setGraphic({ isActive: true })
        }

        if (context.canvas) {
            const click = (e) => {
                if (ref && ref.current && !ref.current.contains(e.target)) {
                    setGraphic({ isActive: false })
                }
            }

            if (context.tool === "pointer") {
                context.canvas.addEventListener("click", click, { once: true })
            } else {
                context.canvas.removeEventListener("click", click, {
                    once: true,
                })
            }
        }
    }

    // Add ref
    useEffect(() => {
        if (graphic && !graphic?.ref && ref && ref.current) {
            setGraphic({ ref: ref.current })
        }
    }, [graphic, name, ref, setGraphic])

    return (
        <>
            <div
                ref={ref}
                name={name}
                style={graphic}
                onClick={onClick}
                className={`graphic ${name}`}
            >
                <MeasureLine width={graphic?.width} />
                <MeasureLine height={graphic?.height} />
                {context?.layer?.[name]?.isActive && (
                    <Selector name={name} graphicRef={ref.current} />
                )}
            </div>
        </>
    )
}

const Line = styled.div`
    position: absolute;
    
    ${({ direction }) =>
        direction === "vertical" &&
        `
            width: 100%;
            height: 12px;
            top: -20px;
            left: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: row;
    `}
    ${({ direction }) =>
        direction === "horizontal" &&
        `
            width: 12px;
            height: 100%;
            top: 50%;
            right: -20px;
            transform: translateY(-50%);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: column;
        `}

    .v-line {
        ${({ width }) =>
            width && `width: ${parseInt(width.split("px")[0]) / 2 - 10}px`};
            height: 1px;
            background-color: white;

        .left-endpoint {
            width: 1px;
            height: 100%;
            position: absolute;
            left: 0;
            top: 50%;
            background-color: white;
            transform: translateY(-50%);
        }
        .right-endpoint {
            width: 1px;
            height: 100%;
            position: absolute;
            right: 0;
            top: 50%;
            background-color: white;
            transform: translateY(-50%);
        }
    }
    
    .h-line {
        ${({ height }) =>
            height && `height: ${parseInt(height.split("px")[0]) / 2 - 30}px`};
        width: 1px;
        background-color: white;

        .top-endpoint {
            width: 100%;
            height: 1px;
            position: absolute;
            left: 50%;
            top: 0;
            background-color: white;
            transform: translateX(-50%);
        }
        .bottom-endpoint {
            width: 100%;
            height: 1px;
            position: absolute;
            left: 50%;
            bottom: 0;
            background-color: white;
            transform: translateX(-50%);
        }
    }

    .length {
        color: white;

        ${({ direction }) =>
            direction === "horizontal" &&
            `
            margin: 10px 0;
            transform: rotate(90deg);`}

        ${({ direction }) =>
            direction === "vertical" &&
            `
            margin: 0 10px;`}
`

const MeasureLine = ({ width, height }) => {
    return (
        <>
            {width && (
                <Line direction={"vertical"} width={width}>
                    <div className='v-line'>
                        <div className='left-endpoint' />
                    </div>
                    <span className='length'>{width}</span>
                    <div className='v-line'>
                        <div className='right-endpoint' />
                    </div>
                </Line>
            )}
            {height && (
                <Line direction={"horizontal"} height={height}>
                    <div className='h-line'>
                        <div className='top-endpoint' />
                    </div>
                    <span className='length'>{height}</span>
                    <div className='h-line'>
                        <div className='bottom-endpoint' />
                    </div>
                </Line>
            )}
        </>
    )
}
