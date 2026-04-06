import Image from "next/image";
import ButtonToCreate from "./ui/buttonToCreate";
import PageHeader from "./ui/pageHeader";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <div className="flex flex-col md:grid md:grid-rows-[100_auto] gap-3 w-full">
        <PageHeader title={"Добро пожаловать"} />
        <div className="rounded-md h-full p-6 md:p-8 flex flex-col justify-between items-center gap-6 bg-bg-secondary">
          <div className="text-center space-y-6">
            {/* Акцентная иконка из второго варианта */}
            <div className="inline-flex items-center justify-center p-3 bg-linear-to-br from-accent/20 to-accent/5 rounded-full">
              <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            {/* Заголовок из второго варианта */}
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="text-text-primary">Умный учёт </span>
              <span className="text-accent">общих трат</span>
            </h1>

            {/* Текст из второго варианта */}
            <p className="text-text-secondary text-base md:text-lg max-w-md mx-auto">Простой способ делиться расходами с друзьями. Рестораны, поездки, квартиры — больше никакой путаницы в деньгах.</p>

            {/* Список возможностей в стиле первого варианта (с галочками) */}
            <div className="max-w-md mx-auto space-y-3 text-left mt-6">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                  <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm md:text-base text-text-primary">Добавляйте друзей и создавайте группы</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                  <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm md:text-base text-text-primary">Создавайте чеки в ресторане, кафе или за аренду</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                  <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm md:text-base text-text-primary">Все видят, кто и сколько должен за общие покупки</span>
              </div>
            </div>
          </div>

          <span className="block w-full bg-bg-tertiary h-px"></span>

          <Link className="button bg-accent text-text-inverted text-lg px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all" href={"/login"}>
            Начать использовать →
          </Link>
        </div>
      </div>
    </>
  );
}
