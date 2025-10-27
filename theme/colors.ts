export const Colors = {
    primary: "#901C9C",
    eliminate: "#da1616ff"
}

export function cambiarColor(color: string): void {
    console.log("COLORS : se cambia color PRIMARY a : ", color)
    Colors.primary = color
}

export function defaultColor(): void {
    Colors.primary = "#901C9C"
}