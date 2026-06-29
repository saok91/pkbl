/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HandBalanceBar } from "./hand-balance-bar";

describe("HandBalanceBar", () => {
  it("shows actual left/right hand shares from breakdown", () => {
    render(
      <HandBalanceBar
        handBalance={0.9}
        leftHandShare={0.45}
        rightHandShare={0.55}
      />,
    );

    expect(screen.getByText(/چپ/)).toHaveTextContent("۴۵٪");
    expect(screen.getByText(/راست/)).toHaveTextContent("۵۵٪");
  });

  it("exposes qualitative balance in aria-label", () => {
    render(
      <HandBalanceBar
        handBalance={0.98}
        leftHandShare={0.5}
        rightHandShare={0.5}
      />,
    );

    expect(
      screen.getByRole("img", { name: /تعادل دست: خوب/ }),
    ).toBeInTheDocument();
  });
});
