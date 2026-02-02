import React from "react";
import { Link, useNavigate } from "react-router-dom";
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

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-900 flex flex-col items-center px-6">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mt-24 mb-24">
        <h1 className="text-6xl font-extrabold tracking-tight bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Thrift Commerce
        </h1>

        <p className="mt-6 text-xl text-slate-600">
          Buy & sell premium second-hand products.
          <span className="text-blue-600 font-semibold">
            {" "}
            Sustainable. Smart. Affordable.
          </span>
        </p>

        <Link to="/dashboard">
          <button className="mt-10 px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg rounded-full shadow-xl transition transform hover:-translate-y-1">
            Explore Marketplace
          </button>
        </Link>
      </div>

      {/* Trust Section */}
      <div className="max-w-6xl w-full text-center">
        <h2 className="text-4xl font-bold mb-4">
          Built for Smart Sustainable Commerce
        </h2>
        <p className="text-slate-600 mb-12 text-lg">
          Join thousands of users making smarter buying decisions while reducing
          waste.
        </p>

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
      </div>

      {/* Featured Items */}
      <div className="mt-16 w-full max-w-7xl">
        <h2 className="text-4xl font-bold text-center mb-14">
          Featured Listings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
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
  <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition">
    <h3 className="text-3xl font-bold text-blue-600">{icon}</h3>
    <h4 className="text-xl font-semibold mt-3">{title}</h4>
    <p className="text-slate-600 mt-2">{text}</p>
  </div>
);

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => (
  <div className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-3">
    <div className="overflow-hidden rounded-xl">
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
      />
    </div>

    <h3 className="text-2xl font-semibold mt-5">{item.title}</h3>
    <p className="text-slate-600 mt-2">{item.condition}</p>

    <div className="mt-4 flex justify-between items-center">
      {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">View</button> */}
    </div>
  </div>
);

export default Home;
