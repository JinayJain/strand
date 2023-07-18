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
  const { redirect } = router.query;

  const [name, setName] = useState<string>("");
  const setUserName = api.user.setUserName.useMutation();

  const handleSubmit = async () => {
    try {
      await setUserName.mutateAsync({
        username: name,
      });
    } catch (e) {
      console.log(e);
    }

    await update();
  };

  useEffect(() => {
    const fn = async () => {
      if (session && hasOnboarded(session.user)) {
        await router.replace(redirect ? String(redirect) : "/");
      }
    };

    void fn();
  }, [redirect, router, session]);

  return (
    <Layout pageTitle="Onboarding" redirectToOnboarding={false}>
      <div className="space-y-2">
        <h1 className="text-xl font-bold">Just one more thing...</h1>
        <p>What is your name?</p>
        <TextInput
          placeholder="Username"
          value={name}
          onChange={setName}
          hint="This will be displayed publicly."
          error={setUserName.error?.data?.zodError?.fieldErrors?.username?.[0]}
        />
        <Button onClick={handleSubmit}>Continue</Button>
      </div>
    </Layout>
  );
}
