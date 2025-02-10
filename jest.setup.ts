import '@testing-library/jest-dom'
global.structuredClone =
    global.structuredClone || ((obj) => JSON.parse(JSON.stringify(obj)));
 
global.matchMedia = global.matchMedia || function () {
        return {
            matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn(),
        };
    };