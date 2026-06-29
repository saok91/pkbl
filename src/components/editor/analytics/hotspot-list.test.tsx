/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { getDefaultTemplate } from "@/lib/layout";
import type { ScoreHotspot } from "@/lib/scoring/types";

import { HotspotList } from "./hotspot-list";

const hotspots: readonly ScoreHotspot[] = [
  { char: "ا", cost: 42.5, keyId: "key-a" },
  { char: "ب", cost: 18.2, keyId: "key-b" },
];

describe("HotspotList", () => {
  it("shows qualitative labels in simple variant", () => {
    render(
      <HotspotList
        hotspots={hotspots}
        layout={getDefaultTemplate()}
        onHotspotSelect={vi.fn()}
        variant="simple"
      />,
    );

    expect(screen.getByText("بسیار پرهزینه")).toBeInTheDocument();
    expect(screen.queryByText("42.5")).not.toBeInTheDocument();
  });

  it("shows raw cost in expert variant", () => {
    render(
      <HotspotList
        hotspots={hotspots}
        layout={getDefaultTemplate()}
        onHotspotSelect={vi.fn()}
        variant="expert"
      />,
    );

    expect(screen.getByText(/42|۴۲/)).toBeInTheDocument();
  });

  it("calls onHotspotSelect when row clicked", () => {
    const onHotspotSelect = vi.fn();
    render(
      <HotspotList
        hotspots={hotspots}
        layout={getDefaultTemplate()}
        onHotspotSelect={onHotspotSelect}
        variant="simple"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /ا/ }));
    expect(onHotspotSelect).toHaveBeenCalledWith("key-a");
  });
});
