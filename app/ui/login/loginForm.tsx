import GoogleSignIn from "./googleSignIn";
import YandexSignIn from "./yandexSignIn";

export default function LoginForm() {
  return (
    <>
      <div className="p-4 rounded-lg flex flex-col justify-center items-center gap-3">
        <GoogleSignIn />
        <YandexSignIn />
      </div>
    </>
  );
}
