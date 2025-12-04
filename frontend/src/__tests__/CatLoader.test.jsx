import { render, screen } from "@testing-library/react";
import CatLoader from "../components/CatLoader";

describe("CatLoader", () => {
  it("renders the default label and status role", () => {
    render(<CatLoader />);

    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByText("Furly is thinking")).toBeInTheDocument();
  });

  it("allows overriding the label text", () => {
    render(<CatLoader label="Loading kittens" />);

    expect(screen.getByText("Loading kittens")).toBeVisible();
  });
});
