import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/ui/ProductCard";
import { CATEGORIES, getByCategory } from "@/lib/catalog";
import { PageHero } from "@/components/layout/PageHero";

export const Route = createFileRoute("/shop/$category")({
  loader: ({ params }) => {
    const cat = CATEGORIES.find((c) => c.slug === params.category);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.cat.name} — KRONOS` },
          { name: "description", content: loaderData.cat.desc },
        ]
      : [{ title: "دسته — KRONOS" }],
  }),
  notFoundComponent: () => (
    <div className="container mx-auto py-32 text-center" dir="rtl">
      <h2 className="text-2xl text-[#F0EDE8] mb-4">دسته‌بندی پیدا نشد</h2>
      <Link to="/shop" className="text-[#C9A84C] border-b border-[#C9A84C44]">
        بازگشت به فروشگاه
      </Link>
    </div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const items = getByCategory(cat.slug);
  return (
    <>
      <PageHero eyebrow="دسته‌بندی" title={cat.name} sub={cat.desc}>
        <div className="flex gap-2 flex-wrap mt-4">
          {cat.brands.map((b: string) => (
            <span
              key={b}
              className="text-[10px] sm:text-xs px-3 py-1 border tracking-wider"
              style={{
                borderColor: `${cat.color}44`,
                color: cat.color,
                background: `${cat.color}10`,
              }}
            >
              {b}
            </span>
          ))}
        </div>
      </PageHero>
      <section className="py-10 px-5 sm:px-8" dir="rtl">
        <div className="container mx-auto">
          {items.length === 0 ? (
            <p className="text-center text-[#8A8A8A] py-20">محصولی در این دسته نیست.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {items.map((w) => (
                <ProductCard key={w.id} watch={w} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
