import DevSignIn from "./devSignIn";
import GoogleSignIn from "./googleSignIn";
import YandexSignIn from "./yandexSignIn";

export default function LoginForm() {
  const isDevLogin = process.env.NEXT_PUBLIC_DEV_LOGIN == "true";

  return (
    <>
      <div className="p-4 rounded-lg flex flex-col justify-center items-center gap-3">
        <GoogleSignIn />
        <YandexSignIn />

        {isDevLogin && <DevSignIn />}
      </div>
    </>
  );
}
