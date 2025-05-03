export default function Home() {
  const front_url = process.env.NEXT_PUBLIC_PROD_URL;
  const back_url = process.env.API_URL;

  async function getData() {
    const res = await fetch("/api/auth", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log(res);
    const data = await res.json();
    console.log(data);
    if (res.status === 200) {
      console.log("success");
    }
    if (res.status === 401) {
      console.log("Unauthorized");
    }
  }
  getData();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl sm:text-6xl font-bold text-center sm:text-left">
          Welcome to Niyam
        </h1>
        <p className="text-lg sm:text-xl text-center sm:text-left">
          More about Niyam coming soon! Niyam is a Law based project being built
          for Final year project.
          <br />
          <a
            href="https://achyutkoirala.com.np"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            more about me
          </a>
          <br />
          {front_url}
          <br />
          {back_url}
        </p>
        <div className="flex flex-col gap-4">
          <a
            href="/login"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Register
          </a>
          <a
            href="/dashboard"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Dashboard
          </a>
          <a
            href="/api/auth"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            API Auth
          </a>
          <a
            href="/api/auth/login"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            API Auth Login
          </a>
          <a
            href="/api/auth/register"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            API Auth Register
          </a>
          <a
            href="/api/auth/logout"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            API Auth Logout
          </a>
          <a
            href="/api/auth/user"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            API Auth User
          </a>
          <a
            href="/api/auth/refresh"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            API Auth Refresh
          </a>
          <a
            href="/api/auth/verify"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            API Auth Verify
          </a>
        </div>
      </main>
    </div>
  );
}
