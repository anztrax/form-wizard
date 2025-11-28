import "@testing-library/jest-dom/vitest";

// Mock scrollIntoView since jsdom doesn't implement it
Element.prototype.scrollIntoView = () => {};
