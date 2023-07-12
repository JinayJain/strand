import Layout from "@/components/Layout";
import Link from "next/link";

export default function Home() {
  return (
    <Layout pageTitle="Strand">
      <p>
        Strand is a collaborative storytelling platform. It&apos;s like a
        choose-your-own-adventure book, but with friends!
      </p>
      <Link href="/t" className="self-center">
        <button className="border px-3 py-2 text-center hover:bg-gray-200">
          Explore strands
        </button>
      </Link>
    </Layout>
  );
}
