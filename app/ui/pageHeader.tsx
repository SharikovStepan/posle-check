export default function PageHeader({ title }: { title: string }) {
  return <h2 className="rounded-md p-4 bg-secondary text-secondary-foreground shadow-sm border border-border w-full flex justify-center items-center text-3xl">
  {title}
</h2>
}
