import React from "react";
import { render, screen } from '@testing-library/react';
import {cleanParenthesis} from "./utils/translateUtils";

// import App from './App';
//
// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

describe("test describe", () => {
  test("ok", () => {
    expect(cleanParenthesis("Field (mathematics)")).toBe("Field");
    expect(cleanParenthesis("dãy (toán)")).toBe("dãy");
  })
})