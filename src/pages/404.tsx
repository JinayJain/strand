import Button from "@/components/Button";
import Layout from "@/components/Layout";
import Link from "next/link";

export default function Page404() {
  return (
    <Layout pageTitle="404">
      <div className="mt-12 flex flex-col space-y-4 text-center">
        <p className="text-xl">
          Sorry, we couldn&apos;t find the page you were looking for.
        </p>
        <Link href="/">
          <Button>Go home</Button>
        </Link>
      </div>
    </Layout>
  );
}
