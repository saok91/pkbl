import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DraftSaveIndicator } from "./draft-save-indicator";

describe("DraftSaveIndicator", () => {
  it("shows hydrating message before draft restore completes", () => {
    render(
      <DraftSaveIndicator
        isHydrated={false}
        isSaving={false}
        lastSavedAt={null}
        saveError={null}
      />,
    );

    expect(screen.getByText("در حال بارگذاری پیش‌نویس…")).toBeInTheDocument();
  });

  it("shows saving message while debounced write is pending", () => {
    render(
      <DraftSaveIndicator
        isHydrated
        isSaving
        lastSavedAt={null}
        saveError={null}
      />,
    );

    expect(screen.getByText("در حال ذخیره…")).toBeInTheDocument();
  });

  it("shows saved timestamp after successful write", () => {
    render(
      <DraftSaveIndicator
        isHydrated
        isSaving={false}
        lastSavedAt="2026-06-30T12:00:00.000Z"
        saveError={null}
      />,
    );

    expect(screen.getByText(/پیش‌نویس ذخیره شد/)).toBeInTheDocument();
  });

  it("shows storage error with alert role", () => {
    render(
      <DraftSaveIndicator
        isHydrated
        isSaving={false}
        lastSavedAt={null}
        saveError="فضای ذخیره‌سازی مرورگر پر است — پیش‌نویس ذخیره نشد."
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("فضای ذخیره");
  });

  it("renders nothing when hydrated with no prior save", () => {
    const { container } = render(
      <DraftSaveIndicator
        isHydrated
        isSaving={false}
        lastSavedAt={null}
        saveError={null}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
