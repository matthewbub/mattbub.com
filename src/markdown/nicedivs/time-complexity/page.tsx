import Link from "next/link";

export default function Page() {
  return (
    <section>
      <h1 className="mb-0 text-2xl font-semibold tracking-tighter">
        Time Complexity
      </h1>
      <div className="flex flex-row">
        <div className="bg-red-500 w-2 h-3"></div>
        <div className="bg-blue-500 w-3 h-3"></div>
        <div className="bg-green-500 w-4 h-3"></div>
        <div className="bg-yellow-500 w-5 h-3"></div>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold tracking-tighter mb-0">
          tf is time complexity
        </h2>

        <p></p>
      </div>
    </section>
  );
}
