import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/fade-in";
import Link from "next/link";

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
}

async function getFeaturedProducts() {
  // SSR demonstration: Fetching data on the server
  // In a real app, this would be a database call or internal API
  try {
      const res = await fetch('https://dummyjson.com/products?limit=4', { cache: 'no-store' });
      if (!res.ok) {
        return { products: [] };
      }
      return res.json();
  } catch (e) {
      console.error(e);
      return { products: [] };
  }
}

export default async function Home() {
  const data = await getFeaturedProducts();
  const products: Product[] = data.products || [];

  return (
    <div className="flex flex-col gap-10 pb-10">
      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <FadeIn>
              <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Welcome to Next.js 14 Starter
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                A complete stack with TypeScript, Tailwind CSS, Shadcn UI, and Framer Motion.
                Ready for your next project.
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="space-x-4">
                <Button asChild size="lg">
                    <Link href="/login">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                    <Link href="https://github.com/shadcn/ui" target="_blank">
                        GitHub
                    </Link>
                </Button>
              </div>
            </FadeIn>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold">
            Featured Products
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Server-side rendered products fetched from dummyjson.com.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-4">
          {products.map((product) => (
            <FadeIn key={product.id} className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                    <h3 className="font-bold line-clamp-1">{product.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <span className="font-semibold">${product.price}</span>
                    <Button size="sm" variant="secondary">View</Button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
      
      {/* Promotions Section */}
      <section className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">
                Promotions
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Sign up for our newsletter to get the latest updates and promotions.
            </p>
            <form className="flex w-full max-w-sm items-center space-x-2">
                <input 
                    type="email" 
                    placeholder="Email" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button type="submit">Subscribe</Button>
            </form>
        </div>
      </section>

    </div>
  );
}
