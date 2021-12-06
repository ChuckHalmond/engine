export { Injector };
export { InjectorBase };
export { Inject };
export { Register };
interface InjectorConstructor {
    readonly prototype: Injector;
    new <C extends Constructor<any>>(args: {
        defaultCtor: C;
        onDefaultOverride: (constructor: C) => void;
    }): Injector<C>;
}
interface Injector<C extends Constructor<any> = Constructor<any>> {
    readonly defaultCtor: C;
    overrideDefaultCtor(constructor: C): void;
    forceQualifier(qualifier: string): void;
    unforceQualifier(): void;
    getConstructor(qualifier?: string): C;
    inject(args?: {
        qualifier?: string;
        args?: ConstructorParameters<C>;
    }): InstanceType<C>;
    register(constructor: C, qualifier: string): void;
}
declare class InjectorBase<C extends Constructor<any> = Constructor<any>> implements Injector<C> {
    private _forcedQualifier?;
    private _constructors;
    private _defaultCtor;
    private _onDefaultOverride;
    get defaultCtor(): C;
    overrideDefaultCtor(constructor: C): void;
    constructor(args: {
        defaultCtor: C;
        onDefaultOverride: (constructor: C) => void;
    });
    forceQualifier(qualifier: string): void;
    unforceQualifier(): void;
    getConstructor(qualifier?: string): C;
    inject(args?: {
        qualifier?: string;
        args?: ConstructorParameters<C>;
    }): InstanceType<C>;
    register(constructor: C, qualifier: string): void;
}
declare const Injector: InjectorConstructor;
declare type UnwrappedInjectorConstructor<I> = I extends Injector<infer C> ? C : never;
interface RegisterDecorator {
    <I extends Injector>(injector: I, qualifier?: string): <C extends UnwrappedInjectorConstructor<I>>(ctor: C) => C;
}
declare const Register: RegisterDecorator;
declare function Inject<I extends Injector, P extends ConstructorParameters<UnwrappedInjectorConstructor<I>>>(injector: I, options?: {
    qualifier?: string;
    args?: P;
}): any;
