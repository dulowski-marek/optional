import { Optional } from './Optional';

describe(`Optional`, () => {
    const SHOULD_HAVE_VALUE_ERROR = new Error(
        `Test Optional should have value`
    );

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe(`empty() constructor`, () => {
        test(`construct an empty Optional`, () => {
            // when
            const optional = Optional.empty();

            // then
            expect(optional.hasValue()).toBe(false);
        });
    });

    describe(`of(value) constructor`, () => {
        test(`construct Optional with underlying value`, () => {
            // given
            const mockValue = Symbol();

            // when
            const optional = Optional.of(mockValue);

            // then
            expect(optional.hasValue()).toBe(true);
            expect(optional.getOrThrow(SHOULD_HAVE_VALUE_ERROR)).toBe(
                mockValue
            );
        });

        test(`return empty Optional if value is null or undefined`, () => {
            // given
            const emptyValues = [null, undefined];

            emptyValues.forEach((emptyValue) => {
                // when
                const resultOptional = Optional.of(emptyValue);

                // then
                expect(resultOptional.hasValue()).toBe(false);
            });
        });
    });

    describe(`flatMap()`, () => {
        test(`if full, use the project fn to map to new Optional`, () => {
            // given
            const mappedValue = Symbol(`Mapped`);
            const mappedOptional = Optional.of(mappedValue);

            const originalValue = Symbol(`Original`);
            const originalOptional = Optional.of(originalValue);

            const mockProjectFn = jest.fn(() => mappedOptional);

            // when
            const resultOptional = originalOptional.flatMap(mockProjectFn);

            // then
            expect(mockProjectFn).toHaveBeenCalledWith(originalValue);
            expect(resultOptional.hasValue()).toBe(true);
            expect(resultOptional.getOrThrow(SHOULD_HAVE_VALUE_ERROR)).toBe(
                mappedValue
            );
        });

        test(`if empty, return an empty Optional`, () => {
            // given
            const originalOptional = Optional.empty();

            const mockProjectFn = jest.fn();

            // when
            const resultOptional = originalOptional.flatMap(mockProjectFn);

            // then
            expect(mockProjectFn).not.toHaveBeenCalled();
            expect(resultOptional.hasValue()).toBe(false);
        });
    });

    describe(`map()`, () => {
        test(`if full, use project fn to map to new value`, () => {
            // given
            const originalValue = 2;
            const originalOptional = Optional.of(originalValue);

            const mockProjectFn = jest.fn((val) => val * 2);

            // when
            const resultOptional = originalOptional.map(mockProjectFn);

            // then
            expect(mockProjectFn).toHaveBeenCalledWith(originalValue);
            expect(resultOptional.hasValue()).toBe(true);
            expect(resultOptional.getOrThrow(SHOULD_HAVE_VALUE_ERROR)).toBe(4);
        });

        test(`if empty, return an empty Optional`, () => {
            // given
            const originalOptional = Optional.empty();

            const mockProjectFn = jest.fn();

            // when
            const resultOptional = originalOptional.map(mockProjectFn);

            // then
            expect(mockProjectFn).not.toHaveBeenCalled();
            expect(resultOptional.hasValue()).toBe(false);
        });
    });

    describe(`getOrElse()`, () => {
        test(`if full, return the underlying value`, () => {
            // given
            const originalValue = `originalValue`;
            const fullOptional = Optional.of(originalValue);

            const elseValue = `elseValue`;

            // when
            const resultValue = fullOptional.getOrElse(elseValue);

            // then
            expect(resultValue).toBe(originalValue);
        });

        test(`if empty, return the else value`, () => {
            // given
            const emptyOptional = Optional.empty();

            const elseValue = `elseValue`;

            // when
            const resultValue = emptyOptional.getOrElse(elseValue);

            // then
            expect(resultValue).toBe(elseValue);
        });
    });

    describe(`getOrThrow()`, () => {
        test(`if full, return the underlying value`, () => {
            // given
            const originalValue = `originalValue`;
            const fullOptional = Optional.of(originalValue);

            const getResultValue = () =>
                fullOptional.getOrThrow(SHOULD_HAVE_VALUE_ERROR);

            // then
            expect(getResultValue).not.toThrow();
            expect(getResultValue()).toBe(originalValue);
        });

        test(`if empty, throw an error`, () => {
            // given
            const emptyOptional = Optional.empty();

            const getResultValue = () =>
                emptyOptional.getOrThrow(SHOULD_HAVE_VALUE_ERROR);

            // then
            expect(getResultValue).toThrow(SHOULD_HAVE_VALUE_ERROR);
        });
    });

    describe(`withValue()`, () => {
        test(`if full, call the function with value and return Optional`, () => {
            // given
            const originalValue = `originalValue`;
            const fullOptional = Optional.of(originalValue);
            const mockWithFn = jest.fn();

            // when
            const result = fullOptional.withValue(mockWithFn);

            // then
            expect(mockWithFn).toHaveBeenCalledWith(originalValue);
            expect(result).toEqual(fullOptional);
        });

        test(`if empty, don't call the function and return Optional`, () => {
            // given
            const emptyOptional = Optional.empty();
            const mockWithFn = jest.fn();

            // when
            const result = emptyOptional.withValue(mockWithFn);

            // then
            expect(mockWithFn).not.toHaveBeenCalled();
            expect(result).toEqual(emptyOptional);
        });
    });
});
