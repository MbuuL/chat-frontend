import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { apiPost } from "../lib/api";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const data = await apiPost<LoginResponse>("/auth/login", {
          username: value.username,
          password: value.password,
        });
        localStorage.setItem("token", data.token);
        navigate({ to: "/" });
      }
      catch (err) {
        setServerError(err instanceof Error ? err.message : "Login failed");
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Log In
        </h2>

        {serverError && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <form.Field
            name="username"
            validators={{
              onChange: ({ value }) =>
                value.length < 1 ? "Username is required" : undefined,
            }}
          >
            {field => (
              <div>
                <label
                  htmlFor={field.name}
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                value.length < 1 ? "Password is required" : undefined,
            }}
          >
            {field => (
              <div>
                <label
                  htmlFor={field.name}
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Subscribe
            selector={state => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </button>
            )}
          </form.Subscribe>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?
          {" "}
          <Link to="/register" className="text-blue-600 hover:underline" mask={{ to: "/" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
