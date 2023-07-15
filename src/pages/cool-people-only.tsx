import Layout from "@/components/Layout";

export default function CoolPeopleOnly() {
  return (
    <Layout pageTitle="Cool People Only">
      <div className="space-y-1 text-center">
        <p className="text-sm">
          hey, if you&apos;re here, i think you&apos;re pretty cool.
        </p>
        <p className="text-sm">
          anyways, don&apos;t tell anyone about this page. it can be our little
          secret.
        </p>
        <p className="text-sm">code word is &quot;mango&quot;</p>
        <p className="text-xs text-gray-500">sincerely, jinay @ 2am</p>
      </div>
    </Layout>
  );
}
