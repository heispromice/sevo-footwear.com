"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type Mode = "login" | "register" | "forgot" | "track";

export function AccountContent() {
  const [mode, setMode] = useState<Mode>("login");

  const [submitted, setSubmitted] = useState(false);

  const [passwordError, setPasswordError] = useState("");

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const password = String(data.get("password") ?? "");
    const confirmation = String(data.get("password_confirmation") ?? "");

    if (password !== confirmation) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordError("");
    setSubmitted(true);
  };

  const handleForgot = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const handleTracking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const changeMode = (nextMode: Mode) => {
    setMode(nextMode);
    setSubmitted(false);
    setPasswordError("");
  };

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
      <div className="mx-auto max-w-md">
        <div className="border-b border-border pb-5">
          <p className="sevo-label text-muted-foreground">SEVO ACCOUNT</p>

          <h1 className="sevo-display mt-3 text-3xl md:text-4xl">
            {mode === "login" && "Welcome back"}
            {mode === "register" && "Create account"}
            {mode === "forgot" && "Reset password"}
            {mode === "track" && "Track an order"}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {mode === "login" &&
              "Sign in to manage your account, saved products and orders."}

            {mode === "register" &&
              "Create your SEVO account to manage your profile, wishlist and orders."}

            {mode === "forgot" &&
              "Enter your email address and we’ll send instructions to reset your password."}

            {mode === "track" &&
              "Track a guest order securely without creating an account."}
          </p>
        </div>

        <div className="mt-8">
          {submitted ? (
            <SubmissionState mode={mode} onBack={() => setSubmitted(false)} />
          ) : (
            <>
              {mode === "login" && (
                <form
                  className="space-y-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                  }}
                >
                  <Field
                    id="login-email"
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                  />

                  <Field
                    id="login-password"
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="submit"
                    className="h-12 w-full bg-foreground text-sm font-semibold text-background transition-opacity hover:opacity-90"
                  >
                    Sign in
                  </button>

                  <div className="flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={() => changeMode("forgot")}
                      className="text-left text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    >
                      Forgot password?
                    </button>

                    <button
                      type="button"
                      onClick={() => changeMode("register")}
                      className="text-left font-medium underline underline-offset-4"
                    >
                      Create account
                    </button>
                  </div>
                </form>
              )}

              {mode === "register" && (
                <form className="space-y-5" onSubmit={handleRegister}>
                  <Field
                    id="register-name"
                    label="Full name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                  />

                  <Field
                    id="register-email"
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                  />

                  <Field
                    id="register-phone"
                    label="Phone number"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                  />

                  <div>
                    <Field
                      id="register-password"
                      label="Password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                    />

                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      Use a strong password you do not reuse on another service.
                    </p>
                  </div>

                  <div>
                    <Field
                      id="register-password-confirm"
                      label="Confirm password"
                      name="password_confirmation"
                      type="password"
                      autoComplete="new-password"
                      required
                    />

                    {passwordError && (
                      <p className="mt-2 text-xs text-foreground">
                        {passwordError}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="h-12 w-full bg-foreground text-sm font-semibold text-background transition-opacity hover:opacity-90"
                  >
                    Create account
                  </button>

                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => changeMode("login")}
                      className="font-medium text-foreground underline underline-offset-4"
                    >
                      Sign in
                    </button>
                  </p>
                </form>
              )}

              {mode === "forgot" && (
                <form className="space-y-5" onSubmit={handleForgot}>
                  <Field
                    id="forgot-email"
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                  />

                  <button
                    type="submit"
                    className="h-12 w-full bg-foreground text-sm font-semibold text-background transition-opacity hover:opacity-90"
                  >
                    Send reset link
                  </button>

                  <button
                    type="button"
                    onClick={() => changeMode("login")}
                    className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                  >
                    Back to sign in
                  </button>
                </form>
              )}

              {mode === "track" && (
                <form className="space-y-5" onSubmit={handleTracking}>
                  <Field
                    id="track-order"
                    label="Order number"
                    name="order_number"
                    type="text"
                    autoComplete="off"
                    required
                  />

                  <Field
                    id="track-contact"
                    label="Email or phone number"
                    name="contact"
                    type="text"
                    autoComplete="email"
                    required
                  />

                  <button
                    type="submit"
                    className="h-12 w-full bg-foreground text-sm font-semibold text-background transition-opacity hover:opacity-90"
                  >
                    Find order
                  </button>

                  <button
                    type="button"
                    onClick={() => changeMode("login")}
                    className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                  >
                    Back to account
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {!submitted && (
          <div className="mt-10 border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              {mode === "login"
                ? "Placed an order as a guest?"
                : "Continue shopping"}{" "}
              {mode === "login" ? (
                <button
                  type="button"
                  onClick={() => changeMode("track")}
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  Track your order
                </button>
              ) : (
                <Link
                  href="/shop"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  Browse SEVO
                </Link>
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function SubmissionState({ mode, onBack }: { mode: Mode; onBack: () => void }) {
  const copy =
    mode === "forgot"
      ? {
          label: "RESET REQUEST",
          title: "Instructions requested",
          body: "Once authentication is connected, SEVO will send password-reset instructions to the submitted email address.",
        }
      : mode === "register"
        ? {
            label: "ACCOUNT REQUEST",
            title: "Account ready for connection",
            body: "The registration form is prepared for the SEVO authentication service. Your account will only be created once the secure backend is connected.",
          }
        : {
            label: "ORDER TRACKING",
            title: "Tracking ready for connection",
            body: "Guest order lookup will be securely resolved by the SEVO backend once order tracking is connected.",
          };

  return (
    <div className="border border-border p-6">
      <p className="sevo-meta text-muted-foreground">{copy.label}</p>

      <h2 className="sevo-display mt-4 text-2xl">{copy.title}</h2>

      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        {copy.body}
      </p>

      <button
        type="button"
        onClick={onBack}
        className="sevo-label mt-8 border-b border-foreground pb-1"
      >
        Return
      </button>
    </div>
  );
}

function Field({
  id,
  label,
  name,
  type = "text",
  autoComplete,
  required,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="sevo-label mb-2 block">
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="h-12 w-full border border-border bg-background px-4 text-sm outline-none transition-colors focus:border-foreground"
      />
    </div>
  );
}
