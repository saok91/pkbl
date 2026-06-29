import { describe, expect, it } from "vitest";

import { describeSubmitPreview, describeSubmitResult } from "./submit-messages";
import { MIN_LAYOUT_COMPLETENESS } from "./submit-rules";

describe("describeSubmitPreview", () => {
  it("warns when layout is incomplete", () => {
    const message = describeSubmitPreview({
      totalScore: 900,
      currentBestScore: null,
      completenessScore: MIN_LAYOUT_COMPLETENESS - 10,
    });

    expect(message.tone).toBe("error");
    expect(message.title).toBe("چیدمان ناقص");
  });

  it("celebrates when score beats current best", () => {
    const message = describeSubmitPreview({
      totalScore: 980,
      currentBestScore: 950,
      completenessScore: 100,
    });

    expect(message.tone).toBe("success");
    expect(message.title).toBe("بهتر از رتبهٔ ۱");
  });

  it("explains when score is below current best", () => {
    const message = describeSubmitPreview({
      totalScore: 800,
      currentBestScore: 950,
      completenessScore: 100,
    });

    expect(message.tone).toBe("info");
    expect(message.message).toContain("۹۵۰");
  });
});

describe("describeSubmitResult", () => {
  it("describes first accepted entry", () => {
    const message = describeSubmitResult({
      kind: "accepted",
      reason: "first_entry",
      rank: 1,
      totalScore: 950,
    });

    expect(message.tone).toBe("success");
    expect(message.title).toBe("اولین ثبت!");
    expect(message.message).toContain("۹۵۰");
  });

  it("describes new best entry with rank", () => {
    const message = describeSubmitResult({
      kind: "accepted",
      reason: "new_best",
      rank: 2,
      totalScore: 980,
    });

    expect(message.tone).toBe("success");
    expect(message.title).toBe("رکورد جدید!");
    expect(message.message).toContain("۹۸۰");
    expect(message.message).toContain("۲");
  });

  it("describes duplicate rejection", () => {
    const message = describeSubmitResult({
      kind: "rejected",
      reason: "duplicate",
      totalScore: 900,
      currentBestScore: null,
    });

    expect(message.tone).toBe("info");
    expect(message.title).toBe("چیدمان تکراری");
  });

  it("describes score too low rejection with current best", () => {
    const message = describeSubmitResult({
      kind: "rejected",
      reason: "score_too_low",
      totalScore: 800,
      currentBestScore: 950,
    });

    expect(message.tone).toBe("error");
    expect(message.message).toContain("۸۰۰");
    expect(message.message).toContain("۹۵۰");
  });

  it("describes incomplete layout rejection", () => {
    const message = describeSubmitResult({
      kind: "rejected",
      reason: "incomplete_layout",
      totalScore: 500,
      currentBestScore: null,
    });

    expect(message.tone).toBe("error");
    expect(message.title).toBe("چیدمان ناقص");
  });
});
