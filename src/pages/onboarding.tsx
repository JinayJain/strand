import Button from "@/components/Button";
import Layout from "@/components/Layout";
import TextInput from "@/components/TextInput";
import { api } from "@/utils/api";
import { hasOnboarded } from "@/utils/user";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Onboarding() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const setUserName = api.user.setUserName.useMutation();

  const handleSubmit = async () => {
    await setUserName.mutateAsync({
      name,
    });

    await update();

    await router.push("/");
  };

  useEffect(() => {
    const fn = async () => {
      if (session && hasOnboarded(session.user)) {
        await router.push("/");
      }
    };

    void fn();
  }, [router, session]);

  return (
    <Layout pageTitle="Onboarding" redirectToOnboarding={false}>
      <div className="space-y-2">
        <h1 className="text-xl font-bold">Just one more thing...</h1>
        <p>What is your name?</p>
        <TextInput placeholder="Name" value={name} onChange={setName} />
        <Button onClick={handleSubmit}>Continue</Button>
      </div>
    </Layout>
  );
}
