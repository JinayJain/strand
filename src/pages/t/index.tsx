import Layout from "@/components/Layout";
import { api } from "@/utils/api";
import Link from "next/link";

export default function StrandsList() {
  const strands = api.strand.getRootStrands.useQuery();

  return (
    <Layout pageTitle="Strand">
      <Link href="/t/new" className="hover:text-gray-500 hover:underline">
        Create a new strand
      </Link>

      <ul>
        {strands.data &&
          strands.data.map((strand) => (
            <li key={strand.id}>
              <Link
                href={`/t/${strand.id}`}
                className="hover:text-gray-500 hover:underline"
              >
                {strand.content} by {strand.user.name}
              </Link>
            </li>
          ))}
      </ul>
    </Layout>
  );
}
