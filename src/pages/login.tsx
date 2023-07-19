import Button from "@/components/Button";
import Layout from "@/components/Layout";
import { FEEDBACK_URL } from "@/utils/consts";
import { getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiDiscordFill, RiGithubFill, RiGoogleFill } from "react-icons/ri";

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
  const { error: errorType, callbackUrl: callback } = router.query;
  const callbackUrl = callback ? String(callback) : undefined;
  const [csrfToken, setCsrfToken] = useState<string>("");

  useEffect(() => {
    const fn = async () => {
      const csrf = await getCsrfToken();
      setCsrfToken(csrf ?? "");
    };

    void fn();
  }, []);

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

          <a
            href={FEEDBACK_URL}
            target="_blank"
            className="self-center text-xs text-gray-500 underline hover:text-gray-700"
          >
            Share feedback
          </a>
        </div>
      </div>
    </Layout>
  );
}
