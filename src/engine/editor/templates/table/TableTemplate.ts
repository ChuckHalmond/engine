import { HTMLElementConstructor } from "engine/editor/elements/HTMLElement";

export { HTMLTableTemplateDescription };
export { HTMLTableTemplate };

type HTMLTableTemplateDescription = Partial<Pick<HTMLTableElement, "id" | "className">> & {
    headerCells: (string | Node)[];

    bodyCells: ((string | Node) | {
        type: "header" | "data" | undefined
        content: Node | string
    })[][];

    footerCells: (string | Node | {
        type: "header" | "data" | undefined
        content: Node | string
    })[];
}

interface HTMLTableTemplate {
    (desc: HTMLTableTemplateDescription): HTMLTableElement;
}

const HTMLTableTemplate: HTMLTableTemplate = (desc: HTMLTableTemplateDescription) => {
    
    const thead = HTMLElementConstructor(
        "thead", {
            children: [
                HTMLElementConstructor(
                "tr", {
                    props: {
                        id: desc.id,
                        className: desc.className,
                    },
                    children: desc.headerCells.map((cell) => {
                        return HTMLElementConstructor(
                            "th", {
                                props: {
                                    scope: "col" 
                                },
                                children: [
                                    cell
                                ]
                            }
                        );
                    })
                })
            ]
        }
    );

    const tbody = HTMLElementConstructor(
        "tbody", {
            children: desc.bodyCells.map((row) => {
                return HTMLElementConstructor(
                "tr", {
                    props: {
                        id: desc.id,
                        className: desc.className,
                    },
                    children: row.map((cell) => {
                        if ((typeof cell === "object") && !(cell instanceof Node) && ("type" in cell)) {
                            switch (cell.type) {
                                case "data":
                                default:
                                    return HTMLElementConstructor(
                                        "td", {
                                            children: [
                                                cell.content
                                            ]
                                        }
                                    );
                                case "header":
                                    return HTMLElementConstructor(
                                        "th", {
                                            props: {
                                                scope: "row" 
                                            },
                                            children: [
                                                cell.content
                                            ]
                                        }
                                    );
                            }
                        }
                        else {
                            return HTMLElementConstructor(
                                "td", {
                                    children: [
                                        cell
                                    ]
                                }
                            );
                        }
                    })
                })
            })
        }
    );

    const tfoot = HTMLElementConstructor(
        "tfoot", {
            children: [
                HTMLElementConstructor(
                "tr", {
                    props: {
                        id: desc.id,
                        className: desc.className,
                    },
                    children: desc.footerCells.map((cell) => {
                        if ((typeof cell === "object") && !(cell instanceof Node) && ("type" in cell)) {
                            switch (cell.type) {
                                case "data":
                                default:
                                    return HTMLElementConstructor(
                                        "td", {
                                            children: [
                                                cell.content
                                            ]
                                        }
                                    );
                                case "header":
                                    return HTMLElementConstructor(
                                        "th", {
                                            props: {
                                                scope: "row" 
                                            },
                                            children: [
                                                cell.content
                                            ]
                                        }
                                    );
                            }
                        }
                        else {
                            return HTMLElementConstructor(
                                "td", {
                                    children: [
                                        cell
                                    ]
                                }
                            );
                        }
                    })
                })
            ]
        }
    );

    const table = HTMLElementConstructor(
        "table", {
            props: {
                id: desc.id,
                className: desc.className,
            },
            children: [
                thead,
                tbody,
                tfoot
            ]
        }
    );

    return table;
}