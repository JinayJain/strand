import Layout from "@/components/Layout";
import { api } from "@/utils/api";
import Link from "next/link";

export default function TwinesList() {
  const twines = api.twine.getRootTwines.useQuery();

  return (
    <Layout pageTitle="Twine">
      <Link href="/t/new" className="hover:text-gray-500 hover:underline">
        Create a new twine
      </Link>

      <ul>
        {twines.data &&
          twines.data.map((twine) => (
            <li key={twine.id}>
              <Link
                href={`/t/${twine.id}`}
                className="hover:text-gray-500 hover:underline"
              >
                {twine.content} by {twine.user.name}
              </Link>
            </li>
          ))}
      </ul>
    </Layout>
  );
}
