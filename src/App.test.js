import { render, screen } from "@testing-library/react";
import React from "react";

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  })
}));

jest.mock(
  "react-router-dom",
  () => ({
    BrowserRouter: ({ children }) => <>{children}</>,
    MemoryRouter: ({ children }) => <>{children}</>,
    Routes: ({ children }) => <>{children}</>,
    Route: ({ element }) => element,
    NavLink: ({ children, to, end, ...props }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
    Link: ({ children, to, ...props }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
    Navigate: () => <div>Redirecting</div>,
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: "/" })
  }),
  { virtual: true }
);

const App = require("./App").default;

test("renders the Skill Circle hero content", () => {
  render(<App />);

  expect(screen.getByRole("heading", { name: /how it works/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /get started/i })).toBeInTheDocument();
});
