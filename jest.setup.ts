import '@testing-library/jest-dom'
import cloneDeep from 'lodash.clonedeep';

global.structuredClone =
    global.structuredClone || ((obj) => cloneDeep(obj));

global.matchMedia = global.matchMedia || function () {
        return {
            matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn(),
        };
    };