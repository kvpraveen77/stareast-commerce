const { expect } = require("chai");
const request = require("supertest");
const { spawn } = require("child_process");

const TEST_PORT = process.env.TEST_PORT || "3001";
const BASE_URL = `http://localhost:${TEST_PORT}`;

let serverProcess;

function waitForServerReady(maxAttempts = 40, delayMs = 250) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const tryHealthcheck = async () => {
      attempts += 1;
      try {
        const response = await request(BASE_URL).get("/healthcheck");
        if (response.status === 200) {
          resolve();
          return;
        }
      } catch (error) {
        // Keep retrying until max attempts is reached.
      }

      if (attempts >= maxAttempts) {
        reject(new Error("Server did not become ready in time."));
        return;
      }

      setTimeout(tryHealthcheck, delayMs);
    };

    tryHealthcheck();
  });
}

describe("API Path Coverage", function () {
  let authToken;

  before(async function () {
    serverProcess = spawn("node", ["src/server.js"], {
      env: { ...process.env, PORT: TEST_PORT },
      stdio: "ignore",
      shell: true,
    });

    await waitForServerReady();
  });

  after(function () {
    if (serverProcess && !serverProcess.killed) {
      serverProcess.kill();
    }
  });

  it("covers GET /healthcheck", async function () {
    const response = await request(BASE_URL).get("/healthcheck");

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({ status: "ok" });
  });

  it("covers POST /register with valid user data from README patterns", async function () {
    const uniqueEmail = `john.path.coverage.${Date.now()}@example.com`;
    const payload = {
      name: "John",
      email: uniqueEmail,
      password: "123456",
    };

    const response = await request(BASE_URL).post("/register").send(payload);

    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal("user registered successfully");
    expect(response.body.user).to.include({
      name: payload.name,
      email: payload.email,
    });
    expect(response.body.user).to.have.property("id");
  });

  it("covers POST /login using preloaded README user", async function () {
    const loginPayload = {
      email: "alice@example.com",
      password: "password123",
    };

    const response = await request(BASE_URL).post("/login").send(loginPayload);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("token");
    authToken = response.body.token;
  });

  it("covers POST /checkout with bearer token and valid items", async function () {
    const checkoutPayload = {
      paymentMethod: "cash",
      items: [
        { productId: 1, quantity: 1 },
        { productId: 2, quantity: 2 },
      ],
    };

    const response = await request(BASE_URL)
      .post("/checkout")
      .set("Authorization", `Bearer ${authToken}`)
      .send(checkoutPayload);

    expect(response.status).to.equal(200);
    expect(response.body).to.include({
      message: "checkout completed",
      paymentMethod: "cash",
      subtotal: 1500,
      discount: 150,
      total: 1350,
    });
    expect(response.body.items).to.be.an("array").with.length(2);
  });
});
