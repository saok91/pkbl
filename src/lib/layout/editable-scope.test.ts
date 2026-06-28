import { describe, expect, it } from "vitest";

import {
  EDITABLE_CHARSET,
  isCharInEditableScope,
  isKeyEditable,
  isModifierLabel,
  isSingleCodePoint,
} from "./editable-scope";

describe("isSingleCodePoint", () => {
  it("accepts single BMP characters", () => {
    expect(isSingleCodePoint("ا")).toBe(true);
    expect(isSingleCodePoint("A")).toBe(true);
  });

  it("accepts single supplementary characters", () => {
    expect(isSingleCodePoint("😀")).toBe(true);
  });

  it("rejects empty and multi-code-point strings", () => {
    expect(isSingleCodePoint("")).toBe(false);
    expect(isSingleCodePoint("ab")).toBe(false);
  });
});

describe("isCharInEditableScope", () => {
  it("accepts Persian letters in charset", () => {
    expect(isCharInEditableScope("ا")).toBe(true);
    expect(isCharInEditableScope("ی")).toBe(true);
  });

  it("rejects chars outside charset", () => {
    expect(isCharInEditableScope("😀")).toBe(false);
    expect(isCharInEditableScope("Q")).toBe(false);
  });

  it("rejects multi-code-point strings", () => {
    expect(isCharInEditableScope("ab")).toBe(false);
  });
});

describe("isKeyEditable", () => {
  it("marks modifier labels as non-editable", () => {
    expect(isKeyEditable("Tab")).toBe(false);
    expect(isKeyEditable("Shift")).toBe(false);
  });

  it("marks empty spacebar label as editable", () => {
    expect(isKeyEditable("")).toBe(true);
  });

  it("marks letter keys as editable", () => {
    expect(isKeyEditable("Q")).toBe(true);
  });
});

describe("isModifierLabel", () => {
  it("recognizes known modifier labels", () => {
    expect(isModifierLabel("Backspace")).toBe(true);
    expect(isModifierLabel("Ctrl")).toBe(true);
  });

  it("does not treat letter keys as modifiers", () => {
    expect(isModifierLabel("Q")).toBe(false);
  });
});

describe("EDITABLE_CHARSET", () => {
  it("contains expected Persian letters", () => {
    expect(EDITABLE_CHARSET).toContain("ا");
    expect(EDITABLE_CHARSET).toContain("پ");
    expect(EDITABLE_CHARSET).toContain("ی");
  });
});
