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

    const condition = () => {
        const element = context.layer[name]
        const status = element.status
        const parseElement = (value) => {
            const elementValue = element?.[value]
            if (typeof elementValue === "string") {
                return parseInt(elementValue.split("px")[0])
            }
            // Return some default value here, or handle the error in some other way
            return null
        }
        if (status?.isDrawing || status?.isResizing) {
            return (
                <>
                    {parseElement("width") >= 50 && (
                        <MeasureLine width={graphic?.width} />
                    )}
                    {parseElement("height") >= 50 && (
                        <MeasureLine height={graphic?.height} />
                    )}
                </>
            )
        }
    }
    return (
        <>
            <div
                ref={ref}
                name={name}
                style={graphic}
                onClick={onClick}
                className={`graphic ${name}`}
            >
                {condition()}
                {context?.layer?.[name]?.isActive && (
                    <Selector name={name} graphicRef={ref.current} />
                )}
            </div>
        </>
    )
}

const Line = styled.div.attrs(({ direction, width, height }) => ({
    style: {
        flexDirection: direction === "vertical" ? "row" : "column",
        ...(direction === "vertical"
            ? {
                  width: width,
                  height: "12px",
                  top: "10px",
                  left: "0",
              }
            : {
                  width: "12px",
                  height: height,
                  top: "50%",
                  left: "10px",
                  transform: "translateY(-50%)",
              }),
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
}))`
    position: absolute;

    .v-line {
        height: 1px;
        background-color: white;
    }

    .h-line {
        width: 1px;
        background-color: white;
    }

    .length {
        color: white;
    }

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
`

const MeasureLine = ({ width, height }) => {
    return (
        <>
            {width && (
                <Line direction={"vertical"} width={width}>
                    <div
                        className='v-line'
                        style={{
                            width: `${
                                parseInt(width.split("px")[0]) / 2 - 30
                            }px`,
                        }}
                    >
                        <div className='left-endpoint' />
                    </div>
                    <span className='length'>{width}</span>
                    <div
                        className='v-line'
                        style={{
                            width: `${
                                parseInt(width.split("px")[0]) / 2 - 30
                            }px`,
                        }}
                    >
                        <div className='right-endpoint' />
                    </div>
                </Line>
            )}
            {height && (
                <Line direction={"horizontal"} height={height}>
                    <div
                        className='h-line'
                        style={{
                            height: `${
                                parseInt(height.split("px")[0]) / 2 - 30
                            }px`,
                        }}
                    >
                        <div className='top-endpoint' />
                    </div>
                    <span
                        className='length'
                        style={{ transform: "rotate(90deg)" }}
                    >
                        {height}
                    </span>
                    <div
                        className='h-line'
                        style={{
                            height: `${
                                parseInt(height.split("px")[0]) / 2 - 30
                            }px`,
                        }}
                    >
                        <div className='bottom-endpoint' />
                    </div>
                </Line>
            )}
        </>
    )
}
