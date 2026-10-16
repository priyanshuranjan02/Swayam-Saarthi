import test from "node:test";
import assert from "node:assert/strict";
import { isValidObjectId } from "../utils/objectIdValidator.js";

test("rejects UUIDs as MongoDB ObjectIds", () => {
  assert.equal(
    isValidObjectId("550e8400-e29b-41d4-a716-446655440000"),
    false
  );
});

test("rejects malformed ObjectId strings", () => {
  assert.equal(isValidObjectId("not-a-valid-object-id"), false);
});

test("rejects missing ObjectId values", () => {
  assert.equal(isValidObjectId(undefined), false);
  assert.equal(isValidObjectId(null), false);
  assert.equal(isValidObjectId(""), false);
});

test("accepts a valid MongoDB ObjectId", () => {
  assert.equal(
    isValidObjectId("507f1f77bcf86cd799439011"),
    true
  );
});