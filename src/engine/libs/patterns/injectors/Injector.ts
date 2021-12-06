export { Injector };
export { InjectorBase };
export { Inject };
export { Register };

interface InjectorConstructor {
    readonly prototype: Injector;
    new<C extends Constructor<any>>(args: {defaultCtor: C, onDefaultOverride: (constructor: C) => void}): Injector<C>;
}

interface Injector<C extends Constructor<any> = Constructor<any>> {
    readonly defaultCtor: C;
    overrideDefaultCtor(constructor: C): void;
    forceQualifier(qualifier: string): void;
    unforceQualifier(): void;
    getConstructor(qualifier?: string): C;
    inject(args?: { qualifier?: string, args?: ConstructorParameters<C> }): InstanceType<C>;
    register(constructor: C, qualifier: string): void; 
}

class InjectorBase<C extends Constructor<any> = Constructor<any>> implements Injector<C> {
    private _forcedQualifier?: string;
    private _constructors: Map<string, C>;
    private _defaultCtor: C;
    private _onDefaultOverride: (constructor: C) => void;

    public get defaultCtor(): C {
        return this._defaultCtor;
    }

    public overrideDefaultCtor(constructor: C): void {
        this._defaultCtor = constructor;
        this._onDefaultOverride(constructor);
    }

    constructor(args: {defaultCtor: C, onDefaultOverride: (constructor: C) => void}) {
        this._defaultCtor = args.defaultCtor;
        this._onDefaultOverride = args.onDefaultOverride;
        this._constructors = new Map();
    }

    public forceQualifier(qualifier: string): void {
        this._forcedQualifier = qualifier;
    }

    public unforceQualifier(): void {
        delete this._forcedQualifier;
    }

    public getConstructor(qualifier?: string): C {
        const qualifierValue = this._forcedQualifier || qualifier;
        if (typeof qualifierValue === 'undefined') {
            return this._defaultCtor;
        }
        const constructor = this._constructors.get(qualifierValue);
        if (typeof constructor === 'undefined') {
            throw new Error(`No constructor for qualifier ${qualifierValue}`);
        }
        return constructor;
    }

    public inject(args?: { qualifier?: string, args?: ConstructorParameters<C> }): InstanceType<C> {
        const constructor = this.getConstructor(args?.qualifier);
        if (args?.args) {
            const parameters = Array.from(args.args);
            return new constructor(...parameters);
        }
        return new constructor();
    }

    public register(constructor: C, qualifier: string): void {
        if (!this._constructors.has(qualifier)) {
            this._constructors.set(qualifier, constructor);
        }
    }
}

const Injector: InjectorConstructor = InjectorBase;

type UnwrappedInjectorConstructor<I> = I extends Injector<infer C> ? C : never;

interface RegisterDecorator {
    <I extends Injector>(injector: I, qualifier?: string): <C extends UnwrappedInjectorConstructor<I>>(ctor: C) => C;
}

const Register: RegisterDecorator = function<
    I extends Injector
>(injector: I, qualifier?: string): any {
    return <C extends UnwrappedInjectorConstructor<I>>(
        ctor: C
    ) => {
        if (typeof qualifier !== 'undefined') {
            injector.register(ctor, qualifier);
        }
        injector.register(ctor, ctor.name);
        return ctor;
    }
}

function Inject<
    I extends Injector,
    P extends ConstructorParameters<UnwrappedInjectorConstructor<I>>,
>(injector: I, options?: {qualifier?: string, args?: P}): any {
    return (
        target: any,
        propertyKey: string
    ) => {
        const instance = injector.inject(options);

        Object.defineProperty(target, propertyKey, {
            value: instance
        });
    }
}