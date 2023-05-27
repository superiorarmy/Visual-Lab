import { AppContext } from "../../../../context/webscrumber.context"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import Selector from "./selector"

export default function Graphic({ name, style }) {
    const ref = useRef(null)
    const { context, setContext } = useContext(AppContext)
    const graphic = context?.layer?.[name]
    const setGraphic = useCallback(
        (value, graphicName = name) => {
            setContext((prev) => ({
                ...prev,
                layer: {
                    ...prev.layer,
                    [graphicName]: { ...prev.layer[graphicName], ...value },
                },
            }))
        },
        [name, setContext]
    )

    // remove empty width or height
    useEffect(() => {
        if (style) {
            const { width, height } = style
            if (width === 0 || height === 0) {
                setContext((prev) => {
                    const previous = { ...prev }
                    delete previous.layer[name]
                    return previous
                })
            }
        }
    }, [style, name, setContext])

    // Multiple graphic control
    const autoAddRemove = (array, value) => {
        const index = array.indexOf(value)
        if (index === -1) {
            return [...array, value]
        } else {
            return array.filter((item, idx) => idx !== index)
        }
    }

    useEffect(() => {
        const click = (e) => {
            e.preventDefault()
            e.stopImmediatePropagation()
            const clickedName = e.target.getAttribute("name")

            // Allow multiple active graphics when ctrl/cmd/shift is held
            if (e.shiftKey || e.metaKey || e.ctrlKey) {
                const isActive = context.layer[clickedName]?.isActive ?? false
                const isMoving =
                    context.layer[clickedName]?.status?.isMoving ?? false
                if (clickedName && !isMoving) {
                    setContext((prev) => ({
                        ...prev,
                        activeList: autoAddRemove(prev.activeList, clickedName),
                    }))
                    setGraphic({ isActive: !isActive }, clickedName)
                }
            } else if (!context.activeList.includes(clickedName)) {
                // Make all graphics inactive
                Object.keys(context.layer).forEach((graphicName) => {
                    setContext((prev) => ({
                        ...prev,
                        activeList: [],
                    }))
                    if (graphicName !== "tempGroup") {
                        setGraphic({ isActive: false }, graphicName)
                    }
                })

                console.log(context.activeList, clickedName)
                // If clicked on a graphic, make it active
                if (clickedName) {
                    setContext((prev) => ({
                        ...prev,
                        activeList: [clickedName],
                    }))
                    setGraphic({ isActive: true }, clickedName)
                }
            }
        }

        if (context.tool === "pointer" && context.ref.canvas) {
            window.addEventListener("click", click)
        }

        // Cleanup on unmount or when dependencies change
        return () => {
            if (context.ref.canvas) {
                window.removeEventListener("click", click)
            }
        }
    }, [
        context.layer,
        context.activeList,
        context.tool,
        context.ref,
        setGraphic,
        setContext,
    ])

    // Add ref and attach double click event from different tools
    useEffect(() => {
        if (
            graphic &&
            graphic.width &&
            graphic.height &&
            !graphic?.ref &&
            ref &&
            ref.current
        ) {
            setGraphic({ ref: ref.current })
        }
    }, [graphic, name, ref, setGraphic])

    const condition = () => {
        const element = context?.layer?.[name]
        const status = element?.status
        const parseElement = (value) => {
            const elementValue = element?.[value]
            if (typeof elementValue === "string") {
                return parseInt(elementValue.split("px")[0])
            }
            // Return some default value here, or handle the error in some other way
            return null
        }
        if (status && (status.isDrawing || status.isResizing)) {
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
                style={style}
                className={`graphic ${name}`}
            >
                {condition()}
                {context?.layer?.[name]?.isActive && (
                    <Selector name={name} ref={ref} />
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
