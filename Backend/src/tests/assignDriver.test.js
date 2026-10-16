import test from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";

import Booking from "../models/Booking.js";
import { assignDriver } from "../controllers/bookingController.js";

const createResponse = () => ({
  statusCode: 200,
  body: null,

  status(code) {
    this.statusCode = code;
    return this;
  },

  json(payload) {
    this.body = payload;
    return this;
  },
});

test("assignDriver rejects a UUID booking ID before querying MongoDB", async (t) => {
  const bookingLookup = t.mock.method(Booking, "findById");

  const req = {
    user: { id: "user-1", role: "user" },
    params: {
      bookingId: "550e8400-e29b-41d4-a716-446655440000",
    },
    body: { driverId: "507f1f77bcf86cd799439011" },
  };

  const res = createResponse();

  await assignDriver(req, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    success: false,
    message: "Invalid booking ID",
  });
  assert.equal(bookingLookup.mock.callCount(), 0);
});

test("assignDriver rejects an invalid driver ID before querying MongoDB", async (t) => {
  const bookingLookup = t.mock.method(Booking, "findById");

  const req = {
    user: { id: "user-1", role: "user" },
    params: { bookingId: "507f1f77bcf86cd799439011" },
    body: { driverId: "not-a-valid-object-id" },
  };

  const res = createResponse();

  await assignDriver(req, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    success: false,
    message: "Invalid driver ID",
  });
  assert.equal(bookingLookup.mock.callCount(), 0);
});

test("assignDriver rejects a missing driver ID", async (t) => {
  const bookingLookup = t.mock.method(Booking, "findById");

  const req = {
    user: { id: "user-1", role: "user" },
    params: { bookingId: "507f1f77bcf86cd799439011" },
    body: {},
  };

  const res = createResponse();

  await assignDriver(req, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    success: false,
    message: "Driver ID is required",
  });
  assert.equal(bookingLookup.mock.callCount(), 0);
});