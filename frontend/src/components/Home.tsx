import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface Item {
  id: number;
  image: string;
  title: string;
  condition: string;
}

const featuredItems: Item[] = [
  {
    id: 1,
    image: "/HomePage/purse.jpg",
    title: "Elegant Purse",
    condition: "Barely used, perfect condition",
  },
  {
    id: 2,
    image: "/HomePage/laptop.jpg",
    title: "Gaming Laptop",
    condition: "Recently serviced",
  },
  {
    id: 3,
    image: "/HomePage/clothes.jpg",
    title: "Designer Outfit",
    condition: "Brand new with tags",
  },
];

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center px-6 pb-20 pt-10">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-3xl mt-24 mb-24"
      >
        <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent pb-2">
          Thrift Commerce
        </h1>

        <p className="mt-6 text-xl text-slate-600 leading-relaxed">
          Buy & sell premium second-hand products.
          <span className="text-blue-600 font-semibold block sm:inline mt-2 sm:mt-0">
            {" "}Sustainable. Smart. Affordable.
          </span>
        </p>

        <Link to="/dashboard">
          <button className="mt-10 px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-lg rounded-full shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1 hover:shadow-xl active:scale-95">
            Explore Marketplace
          </button>
        </Link>
      </motion.div>

      {/* Trust Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-6xl w-full text-center"
      >
        <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-4 text-slate-800">
          Built for Smart Sustainable Commerce
        </motion.h2>
        <motion.p variants={itemVariants} className="text-slate-600 mb-12 text-lg">
          Join thousands of users making smarter buying decisions while reducing
          waste.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TrustCard
            title="Sustainable Shopping"
            icon="♻"
            text="Extend product lifecycles and reduce environmental waste."
          />
          <TrustCard
            title="Affordable Pricing"
            icon="₹"
            text="Save up to 70% compared to buying new products."
          />
          <TrustCard
            title="Verified Community"
            icon="🛡"
            text="Trusted sellers, ratings, and secure transactions."
          />
        </div>
      </motion.div>

      {/* Featured Items */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mt-28 w-full max-w-7xl"
      >
        <motion.h2 variants={itemVariants} className="text-4xl font-bold text-center mb-14 text-slate-800">
          Featured Listings
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const TrustCard = ({
  title,
  icon,
  text,
}: {
  title: string;
  icon: string;
  text: string;
}) => (
  <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-white/60">
      <h3 className="text-3xl text-blue-600">{icon}</h3>
    </div>
    <h4 className="text-xl font-bold text-slate-800 mt-3">{title}</h4>
    <p className="text-slate-600 mt-3 leading-relaxed">{text}</p>
  </motion.div>
);

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => (
  <motion.div variants={itemVariants} className="group bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl p-5 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/60 hover:-translate-y-2 transition-all duration-300">
    <div className="overflow-hidden rounded-2xl bg-slate-100">
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-72 object-cover group-hover:scale-105 transition duration-700 ease-out"
      />
    </div>

    <div className="px-2 pt-5 pb-2">
      <h3 className="text-2xl font-bold text-slate-800">{item.title}</h3>
      <p className="text-slate-500 font-medium mt-1">{item.condition}</p>
    </div>
  </motion.div>
);

export default Home;
