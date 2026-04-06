import LoginForm from "../ui/login/loginForm";
import PageHeader from "../ui/pageHeader";

export default function Page() {
  return (
    <>
      <main className="flex flex-col md:grid md:grid-rows-[100_auto] gap-3 w-full">
        <PageHeader title={"Вход"} />
        <div className="rounded-md bg-bg-secondary p-3 flex justify-center items-center">
          <LoginForm />
        </div>
      </main>
    </>
  );
}
