import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-white p-8">
      <div className="max-w-2xl w-full text-center">
        <Image
          src="/logo.svg"
          alt="Zenterview Logo"
          width={120}
          height={120}
          className="mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold mb-4 text-blue-800">
          Welcome to Zenterview
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Zenterview is your platform for seamless, AI-powered interview
          experiences. Sign in to get started or explore your dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/sign-in">
            <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Sign In
            </button>
          </Link>
          <Link href="/sign-up">
            <button className="px-6 py-2 bg-gray-200 text-blue-700 rounded hover:bg-gray-300 transition">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
