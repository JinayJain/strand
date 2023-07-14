import Button from "@/components/Button";
import Layout from "@/components/Layout";
import { api } from "@/utils/api";
import Link from "next/link";

export default function StrandsList() {
  const strands = api.strand.getRootStrands.useQuery();

  return (
    <Layout pageTitle="Strand">
      <Link href="/s/new" className="hover:text-gray-500 hover:underline">
        <Button>Begin a new strand</Button>
      </Link>

      <p className="mt-8 font-bold">Strands</p>
      <ul>
        {strands.data &&
          strands.data.map((strand) => (
            <li key={strand.id}>
              <Link
                href={`/s/${strand.id}`}
                className="hover:text-gray-500 hover:underline"
              >
                {strand.content} by {strand.author.name}
              </Link>
            </li>
          ))}
      </ul>
    </Layout>
  );
}
