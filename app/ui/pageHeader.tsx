export default function PageHeader({ title }: { title: string }) {
  return <h2 className="h-15 text-text-secondary text-3xl flex justify-center items-center">{title}</h2>;
}
