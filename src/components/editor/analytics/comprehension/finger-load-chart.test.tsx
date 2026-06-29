/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FingerLoadChart } from "./finger-load-chart";

describe("FingerLoadChart", () => {
  it("renders finger labels with quality bands", () => {
    render(
      <FingerLoadChart
        fingerLoad={{
          thumb: 0.05,
          index: 0.3,
          middle: 0.3,
          ring: 0.2,
          pinky: 0.15,
        }}
      />,
    );

    expect(screen.getByText("اشاره")).toBeInTheDocument();
    expect(screen.getByText("کوچک")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /نمودار بار انگشتان/ }),
    ).toBeInTheDocument();
  });
});
