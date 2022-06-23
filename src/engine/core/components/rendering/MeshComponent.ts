import { ComponentDesc } from "../../general/Component";

export interface TMeshComponentDesc extends ComponentDesc {
    mesh?: string
}

export class MeshComponent {

    setup(): void {
    }

    cleanup(): void {
    }

    render(): void {}
}