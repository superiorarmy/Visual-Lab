import { AppContext } from "@/context/webscrumber.context"
import { useContext, useState, useEffect } from "react"

export default function useTempGroup() {
    const { context, setContext } = useContext(AppContext)
    const [tempGroup, setTempGroup] = useState({ children: {} })
    useEffect(() => {
        if (context.activeList.length >= 2) {
            // focus
            context.activeList.forEach((active) => {
                if (context.layer[active]) {
                    setTempGroup((prev) => ({
                        ...prev,
                        children: {
                            ...prev.children,
                            [active]: context.layer[active],
                        },
                    }))
                }
            })
        } else if (context.layer?.tempGroup && !context.activeList.length) {
            // release
            setContext((prev) => {
                let newLayers = {}
                const { tempGroup: lastTemp } = prev.layer
                Object.entries(lastTemp.children).forEach(([keys, values]) => {
                    newLayers = {
                        ...newLayers,
                        [keys]: {
                            ...values,
                            left: `${
                                lastTemp.left +
                                parseInt(lastTemp.children[keys].left, 10)
                            }px`,
                            top: `${
                                lastTemp.top +
                                parseInt(lastTemp.children[keys].top, 10)
                            }px`,
                            isActive: false,
                        },
                    }
                })
                return { ...prev, layer: newLayers }
            })

            setTempGroup({ children: {} })
        }
    }, [context.activeList, context.layer, setContext])
    // assign children in tempGroup
    useEffect(() => {
        if (
            Object.keys(tempGroup.children).length ===
                context.activeList.length &&
            Object.keys(tempGroup.children).length &&
            context.activeList.length
        ) {
            setContext((prev) => {
                const excludedLayers = { ...prev.layer }
                Object.keys(tempGroup.children).forEach((active) => {
                    if (excludedLayers[active]) {
                        delete excludedLayers[active]
                    }
                })

                return { ...prev, layer: { ...excludedLayers, tempGroup } }
            })
        }
    }, [tempGroup, context.activeList, setContext])

    return [tempGroup, setTempGroup]
}
