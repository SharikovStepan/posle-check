import { signOut } from "@/auth";
import Image from "next/image";

export default function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}>
      <button
        type="submit"
        className="cursor-pointer flex items-center justify-center px-3 py-2 bg-error rounded-md shadow-sm hover:shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-bg-primary">
        <span className="text-text-primary font-medium text-sm">Выйти из профиля</span>
      </button>
    </form>
  );
}
