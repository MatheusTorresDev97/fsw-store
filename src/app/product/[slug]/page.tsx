import { prismaClient } from "@/lib/prisma";
import ProductImages from "./components/product-images";
import { computeProductTotalPrice } from "@/helpers/product";
import ProductInfo from "./components/product-info";
import SectionTitle from "@/components/ui/section-title";
import ProductList from "@/app/(home)/components/product-list";

interface ProductDetailsPageProps {
  params: {
    slug: string;
  };
}

const ProductDetailsPage = async ({
  params: { slug },
}: ProductDetailsPageProps) => {
  const product = await prismaClient.product.findFirst({
    where: {
      slug: slug,
    },
    include: {
      category: {
        include: {
          products: {
            where: {
              slug: {
                not: slug,
              },
            },
          },
        },
      },
    },
  });

  if (!product) return null;

  return (
    <div className="flex flex-col gap-8 pb-8">
       <ProductImages imageUrls={product.imageUrls} name={product.name} />
       <ProductInfo product={computeProductTotalPrice(product)} />
       <div>
       <SectionTitle>Produtos Recomendados</SectionTitle>
        <ProductList products={product.category.products} />
       </div>
    </div>
  );
};

export default ProductDetailsPage;
