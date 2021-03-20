/**
 * Optional is a variation of Maybe monad. It abstracts out presence or absence of the value.
 * Values of `null` and `undefined` are treated as no value.
 *
 * It has two internal states: it can be either:
 * - full
 * - empty
 */
export class Optional<T> {
    public static empty<T>(): Optional<T> {
        return new Optional((null as unknown) as T);
    }

    public static of<T>(value: T | null | undefined): Optional<T> {
        if (value === null || value === undefined) {
            return Optional.empty();
        }

        return new Optional(value);
    }

    private constructor(private value: T | null) {}

    public flatMap<U>(projectFn: (value: T) => Optional<U>): Optional<U> {
        if (this.value !== null) {
            return projectFn(this.value);
        }

        return Optional.empty();
    }

    public map<U>(projectFn: (value: T) => U): Optional<U> {
        return this.flatMap((value) => Optional.of(projectFn(value)));
    }

    public getOrElse(elseValue: T): T {
        return this.value === null ? elseValue : this.value;
    }

    public getOrThrow(error: Error): T {
        if (this.value === null) {
            throw error;
        }

        return this.value;
    }

    public hasValue(): boolean {
        return this.value !== null;
    }
}
