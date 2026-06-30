/**
 * @vitest-environment jsdom
 */

import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { getBlankAnsiTemplate, getDefaultTemplate } from "@/lib/layout";

import { SubmitLayoutDialog } from "./submit-layout-dialog";

const mutateMock = vi.fn();

type MutationOptions = {
  onSuccess?: (response: {
    success: boolean;
    data: {
      accepted: boolean;
      reason: string;
      rank?: number;
      totalScore: number;
      currentBestScore?: number | null;
    };
  }) => void;
};

let mutationOptions: MutationOptions | undefined;

vi.mock("~/trpc/react", () => ({
  api: {
    useUtils: () => ({
      leaderboard: {
        list: { invalidate: vi.fn() },
        status: { invalidate: vi.fn() },
      },
    }),
    leaderboard: {
      status: {
        useQuery: () => ({
          data: {
            success: true,
            data: {
              currentBestScore: 940,
              currentBestAlias: "top",
              totalEntries: 3,
            },
          },
          isLoading: false,
        }),
      },
      submit: {
        useMutation: (options?: MutationOptions) => {
          mutationOptions = options;
          return {
            mutate: (input: unknown) => {
              mutateMock(input);
            },
            isPending: false,
            error: null,
            reset: vi.fn(),
          };
        },
      },
    },
  },
}));

function simulateSubmitSuccess(
  data: MutationOptions extends undefined
    ? never
    : NonNullable<MutationOptions["onSuccess"]> extends (
          response: infer R,
        ) => void
      ? R
      : never,
) {
  act(() => {
    mutationOptions?.onSuccess?.(data);
  });
}

describe("SubmitLayoutDialog", () => {
  it("renders submit form with score, corpus preset, and preview", () => {
    render(
      <SubmitLayoutDialog
        isOpen
        layout={getDefaultTemplate()}
        corpusPresetId="wiki-fa"
        totalScore={950}
        isScoreStale={false}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("ثبت در جدول امتیازات")).toBeInTheDocument();
    expect(screen.getByText("۹۵۰")).toBeInTheDocument();
    expect(screen.getByText("ویکی‌پدیا فارسی")).toBeInTheDocument();
    expect(screen.getByText("بهتر از رتبهٔ ۱")).toBeInTheDocument();
    expect(screen.getByText("۹۴۰")).toBeInTheDocument();
  });

  it("submits layout with optional alias", () => {
    mutateMock.mockClear();

    render(
      <SubmitLayoutDialog
        isOpen
        layout={getDefaultTemplate()}
        corpusPresetId="wiki-fa"
        totalScore={950}
        isScoreStale={false}
        onClose={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("نام نمایشی (اختیاری)"), {
      target: { value: "my-layout" },
    });
    fireEvent.click(screen.getByRole("button", { name: "ثبت چیدمان" }));

    expect(mutateMock).toHaveBeenCalledOnce();
    expect(mutateMock.mock.calls[0]?.[0]).toMatchObject({
      corpusPresetId: "wiki-fa",
      alias: "my-layout",
    });

    simulateSubmitSuccess({
      success: true,
      data: {
        accepted: true,
        reason: "first_entry",
        rank: 1,
        totalScore: 950,
      },
    });

    expect(screen.getByText("اولین ثبت!")).toBeInTheDocument();
  });

  it("disables submit while score is stale", () => {
    render(
      <SubmitLayoutDialog
        isOpen
        layout={getDefaultTemplate()}
        corpusPresetId="wiki-fa"
        totalScore={950}
        isScoreStale
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "ثبت چیدمان" })).toBeDisabled();
  });

  it("disables submit for incomplete layout preview", () => {
    render(
      <SubmitLayoutDialog
        isOpen
        layout={getBlankAnsiTemplate()}
        corpusPresetId="wiki-fa"
        totalScore={950}
        isScoreStale={false}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("چیدمان ناقص")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ثبت چیدمان" })).toBeDisabled();
  });

  it("shows score too low rejection after submit", () => {
    render(
      <SubmitLayoutDialog
        isOpen
        layout={getDefaultTemplate()}
        corpusPresetId="wiki-fa"
        totalScore={950}
        isScoreStale={false}
        onClose={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "ثبت چیدمان" }));

    simulateSubmitSuccess({
      success: true,
      data: {
        accepted: false,
        reason: "score_too_low",
        totalScore: 950,
        currentBestScore: 980,
      },
    });

    expect(screen.getByText("امتیاز کافی نیست")).toBeInTheDocument();
  });

  it("shows duplicate rejection after submit", () => {
    render(
      <SubmitLayoutDialog
        isOpen
        layout={getDefaultTemplate()}
        corpusPresetId="wiki-fa"
        totalScore={950}
        isScoreStale={false}
        onClose={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "ثبت چیدمان" }));

    simulateSubmitSuccess({
      success: true,
      data: {
        accepted: false,
        reason: "duplicate",
        totalScore: 950,
        currentBestScore: 980,
      },
    });

    expect(screen.getByText("چیدمان تکراری")).toBeInTheDocument();
  });
});
