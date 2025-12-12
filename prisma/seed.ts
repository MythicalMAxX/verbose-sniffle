import { Prisma, PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

type SeedCategory = {
  name: string;
  slug: string;
  description?: string;
};

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAtPrice?: string;
  categorySlugs: string[];
  images: Array<{ url: string; altText?: string; position?: number }>;
  inventory: Array<{
    sku: string;
    variantName?: string;
    variant?: Prisma.InputJsonValue;
    priceOverride?: string;
    stockOnHand: number;
  }>;
  reviews?: Array<{
    userEmail: string;
    rating: number;
    title?: string;
    body?: string;
  }>;
};

async function main() {
  const adminEmail = "admin@demo.local";
  const customerEmail = "customer@demo.local";

  const [adminUser, customerUser] = await Promise.all([
    prisma.user.upsert({
      where: { email: adminEmail },
      update: { name: "Demo Admin", role: Role.ADMIN },
      create: { email: adminEmail, name: "Demo Admin", role: Role.ADMIN },
    }),
    prisma.user.upsert({
      where: { email: customerEmail },
      update: { name: "Demo Customer", role: Role.CUSTOMER },
      create: { email: customerEmail, name: "Demo Customer", role: Role.CUSTOMER },
    }),
  ]);

  const categories: SeedCategory[] = [
    {
      name: "Electronics",
      slug: "electronics",
      description: "Gadgets, gear, and accessories.",
    },
    {
      name: "Apparel",
      slug: "apparel",
      description: "Everyday clothing essentials.",
    },
    {
      name: "Home",
      slug: "home",
      description: "Helpful things for the home.",
    },
    {
      name: "Books",
      slug: "books",
      description: "Reading & learning.",
    },
  ];

  await Promise.all(
    categories.map((c) =>
      prisma.category.upsert({
        where: { slug: c.slug },
        update: { name: c.name, description: c.description },
        create: { name: c.name, slug: c.slug, description: c.description },
      }),
    ),
  );

  const products: SeedProduct[] = [
    {
      name: "Wireless Headphones",
      slug: "wireless-headphones",
      description:
        "Comfortable over-ear headphones with great battery life and low-latency Bluetooth.",
      price: "199.99",
      compareAtPrice: "249.99",
      categorySlugs: ["electronics"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1518441902117-f0a5c2e1e6f9?auto=format&fit=crop&w=1200&q=80",
          altText: "Wireless headphones",
          position: 0,
        },
      ],
      inventory: [
        {
          sku: "HEADPHONES-BLK",
          variantName: "Black",
          variant: { color: "Black" },
          stockOnHand: 48,
        },
      ],
      reviews: [
        {
          userEmail: customerEmail,
          rating: 5,
          title: "Fantastic for the price",
          body: "Comfortable, solid bass, and the battery lasts forever.",
        },
        {
          userEmail: adminEmail,
          rating: 4,
          title: "Great daily driver",
          body: "Good sound and build quality. ANC is decent for the price tier.",
        },
      ],
    },
    {
      name: "Classic T‑Shirt",
      slug: "classic-tshirt",
      description:
        "Soft cotton tee with a relaxed fit. Available in multiple sizes and colors.",
      price: "24.99",
      categorySlugs: ["apparel"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=1200&q=80",
          altText: "Classic t-shirt",
          position: 0,
        },
      ],
      inventory: [
        {
          sku: "TSHIRT-WHT-S",
          variantName: "White / Small",
          variant: { color: "White", size: "S" },
          stockOnHand: 120,
        },
        {
          sku: "TSHIRT-WHT-M",
          variantName: "White / Medium",
          variant: { color: "White", size: "M" },
          stockOnHand: 90,
        },
      ],
      reviews: [
        {
          userEmail: customerEmail,
          rating: 5,
          title: "Staple tee",
          body: "Fits true to size and holds up after washing.",
        },
      ],
    },
    {
      name: "Compact Coffee Maker",
      slug: "compact-coffee-maker",
      description:
        "Small-footprint drip coffee maker for kitchens with limited counter space.",
      price: "89.00",
      categorySlugs: ["home"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=1200&q=80",
          altText: "Coffee maker",
          position: 0,
        },
      ],
      inventory: [
        {
          sku: "COFFEE-MAKER-STD",
          variantName: "Standard",
          variant: { size: "Standard" },
          stockOnHand: 35,
        },
      ],
    },
    {
      name: "Build a Storefront with Next.js",
      slug: "nextjs-storefront-book",
      description:
        "A practical guide to building a modern ecommerce storefront with the Next.js App Router.",
      price: "39.00",
      categorySlugs: ["books"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
          altText: "Book on a table",
          position: 0,
        },
      ],
      inventory: [
        {
          sku: "BOOK-NEXTJS-001",
          variantName: "Paperback",
          variant: { format: "Paperback" },
          stockOnHand: 200,
        },
      ],
    },
  ];

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        price: new Prisma.Decimal(p.price),
        compareAtPrice: p.compareAtPrice ? new Prisma.Decimal(p.compareAtPrice) : null,
        categories: {
          set: p.categorySlugs.map((slug) => ({ slug })),
        },
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: new Prisma.Decimal(p.price),
        compareAtPrice: p.compareAtPrice ? new Prisma.Decimal(p.compareAtPrice) : null,
        categories: {
          connect: p.categorySlugs.map((slug) => ({ slug })),
        },
      },
    });

    for (const [index, img] of p.images.entries()) {
      await prisma.productImage.upsert({
        where: {
          productId_url: {
            productId: product.id,
            url: img.url,
          },
        },
        update: {
          altText: img.altText,
          position: img.position ?? index,
        },
        create: {
          productId: product.id,
          url: img.url,
          altText: img.altText,
          position: img.position ?? index,
        },
      });
    }

    for (const i of p.inventory) {
      await prisma.inventory.upsert({
        where: { sku: i.sku },
        update: {
          productId: product.id,
          variantName: i.variantName,
          variant: i.variant,
          priceOverride: i.priceOverride ? new Prisma.Decimal(i.priceOverride) : null,
          stockOnHand: i.stockOnHand,
        },
        create: {
          productId: product.id,
          sku: i.sku,
          variantName: i.variantName,
          variant: i.variant,
          priceOverride: i.priceOverride ? new Prisma.Decimal(i.priceOverride) : null,
          stockOnHand: i.stockOnHand,
        },
      });
    }

    if (p.reviews?.length) {
      for (const r of p.reviews) {
        const user = r.userEmail === adminEmail ? adminUser : customerUser;

        await prisma.review.upsert({
          where: {
            productId_userId: {
              productId: product.id,
              userId: user.id,
            },
          },
          update: {
            rating: r.rating,
            title: r.title,
            body: r.body,
          },
          create: {
            productId: product.id,
            userId: user.id,
            rating: r.rating,
            title: r.title,
            body: r.body,
          },
        });
      }

      const reviewAgg = await prisma.review.aggregate({
        where: { productId: product.id },
        _avg: { rating: true },
        _count: { rating: true },
      });

      const avg = reviewAgg._avg.rating ?? 0;
      const count = reviewAgg._count.rating ?? 0;

      await prisma.product.update({
        where: { id: product.id },
        data: {
          ratingAverage: new Prisma.Decimal(avg.toFixed(2)),
          ratingCount: count,
        },
      });
    }
  }

  const demoStats = await Promise.all([
    prisma.user.count(),
    prisma.category.count(),
    prisma.product.count(),
    prisma.inventory.count(),
    prisma.review.count(),
  ]);

  console.info(
    `Seed complete. Users: ${demoStats[0]}, Categories: ${demoStats[1]}, Products: ${demoStats[2]}, Inventory items: ${demoStats[3]}, Reviews: ${demoStats[4]}`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
