interface Props {
    children: any;
    className?: string;
    direction?: "horizontal" | "vertical";
    size?: "full" | "half" | "third";
    pad?: boolean;
}

export function Container({ children, className = "", direction = "horizontal", size = "full", pad = true }: Props): JSX.Element {
    let alignment = direction === "horizontal" ? "flex-row space-x-8" : "flex-col space-y-8";
    let length = size === "full" ? "w-full" : size === "half" ? "w-full lg:w-1/2" : "w-full lg:w-1/3";

    const padding = pad ? "p-6" : "";

    const global = `${padding} ${alignment} ${length} ${className}`;

    return <div className={"flex mx-auto justify-between items-center " + global}>{children}</div>;
}
