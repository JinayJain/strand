import Button from "@/components/Button";
import Layout from "@/components/Layout";
import TextInput from "@/components/TextInput";
import Textbox from "@/components/Textbox";
import { FEEDBACK_URL } from "@/utils/consts";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  RiDiscordFill,
  RiGithubFill,
  RiGoogleFill,
  RiMailFill,
} from "react-icons/ri";

const SIGNIN_ERRORS: Record<string, string> = {
  default: "Unable to sign in.",
  signin: "Try signing in with a different account.",
  oauthsignin: "Try signing in with a different account.",
  oauthcallbackerror: "Try signing in with a different account.",
  oauthcreateaccount: "Try signing in with a different account.",
  emailcreateaccount: "Try signing in with a different account.",
  callback: "Try signing in with a different account.",
  oauthaccountnotlinked:
    "To confirm your identity, sign in with the same account you used originally.",
  emailsignin: "The e-mail could not be sent.",
  credentialssignin:
    "Sign in failed. Check the details you provided are correct.",
  sessionrequired: "Please sign in to access this page.",
};

export default function Login() {
  const router = useRouter();
  const { status } = useSession();
  const { error: errorType, callbackUrl: callback } = router.query;
  const callbackUrl = callback ? String(callback) : undefined;
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [showEmail, setShowEmail] = useState<boolean>(false);

  useEffect(() => {
    const fn = async () => {
      const csrf = await getCsrfToken();
      setCsrfToken(csrf ?? "");
    };

    void fn();
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      void router.push(callbackUrl ?? "/");
    }
  }, [status, callbackUrl, router]);

  const error = errorType
    ? SIGNIN_ERRORS[(errorType as string).toLowerCase()] ||
      SIGNIN_ERRORS.default
    : null;

  const AUTH_PROVIDERS = [
    {
      name: "Google",
      icon: <RiGoogleFill size={24} />,
      provider: "google",
    },
    {
      name: "GitHub",
      icon: <RiGithubFill size={24} />,
      provider: "github",
    },
    {
      name: "Discord",
      icon: <RiDiscordFill size={24} />,
      provider: "discord",
    },
  ];

  return (
    <Layout pageTitle="Login">
      <div className="flex flex-col items-center">
        <div className="flex w-full max-w-sm flex-col space-y-4 border p-4">
          {error && (
            <div className="relative border border-red-400 px-4 py-3 text-center text-red-700">
              {error}
            </div>
          )}
          <p className="text-center text-sm">Sign in or create an account</p>

          {AUTH_PROVIDERS.map((provider) => (
            <form
              key={provider.name}
              method="POST"
              action={`/api/auth/signin/${provider.provider}`}
            >
              {callbackUrl && (
                <input name="callbackUrl" type="hidden" value={callbackUrl} />
              )}
              <input name="csrfToken" type="hidden" value={csrfToken} />

              <Button
                key={provider.name}
                type="submit"
                icon={provider.icon}
                className="w-full"
              >
                Continue with {provider.name}
              </Button>
            </form>
          ))}

          <div className="flex items-center justify-center space-x-2">
            <a
              href="#"
              onClick={() => setShowEmail((showEmail) => !showEmail)}
              className="self-center text-xs text-gray-500 underline hover:text-gray-700"
            >
              Email sign-in
            </a>
            <div>
              <a
                href={FEEDBACK_URL}
                target="_blank"
                className="text-xs text-gray-500 underline hover:text-gray-700"
              >
                Share feedback
              </a>
            </div>
          </div>

          {showEmail && (
            <form
              className="space-y-2"
              method="POST"
              action="/api/auth/signin/email"
            >
              {callbackUrl && (
                <input name="callbackUrl" type="hidden" value={callbackUrl} />
              )}
              <input name="csrfToken" type="hidden" value={csrfToken} />

              <TextInput
                name="email"
                placeholder="Email"
                type="email"
                className="w-full"
                hint="We recommend using other sign-in methods if possible."
              />

              <Button type="submit" className="w-full" icon={<RiMailFill />}>
                Send sign-in link
              </Button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
