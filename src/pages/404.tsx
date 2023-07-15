import Button from "@/components/Button";
import Layout from "@/components/Layout";
import Link from "next/link";

export default function Page404() {
  return (
    <Layout pageTitle="404">
      <div className="mt-12 flex flex-col items-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-xl">Page not found</p>
        <Link href="/" className="mt-2">
          <Button>Go home</Button>
        </Link>
      </div>
    </Layout>
  );
}
