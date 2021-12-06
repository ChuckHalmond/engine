import { ComponentDesc } from "../../general/Component";

export interface TMeshComponentDesc extends ComponentDesc {
    mesh?: string
}

export class MeshComponent {

    public setup(): void {
    }

    public cleanup(): void {
    }

    public render(): void {}
}