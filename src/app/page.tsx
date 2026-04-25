import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function Home() {
  return (
    <div className="flex flex-col gap-20">
      <Hero />
      <FeaturedProducts />
      
      {/* Newsletter Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto glass-morphism p-12 rounded-[40px] text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full filter blur-[80px] -mr-32 -mt-32" />
          <h2 className="text-3xl font-bold mb-4">Stay updated on the latest deals</h2>
          <p className="text-gray-400 mb-8">Join our newsletter to receive the best campus offers and community updates.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex-grow outline-none focus:border-primary/50 transition-all text-white"
            />
            <button className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
