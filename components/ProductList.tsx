"use client"; // ✅ Client Component — nécessaire pour Framer Motion
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";

// Animation du conteneur : orchestre le délai entre chaque carte (stagger)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }, // 80ms de délai entre chaque carte
  },
};

// Animation de chaque carte : monte de 20px en devenant visible
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ProductList({ products }: { products: Product[] }) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}        // Légère mise en avant au survol
          transition={{ duration: 0.2 }}       // Rapide < 200ms (GPU-accelerated)
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}