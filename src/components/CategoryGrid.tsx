import { categories } from "@/data/storeData";

interface CategoryGridProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const CategoryGrid = ({ selectedCategory, onCategorySelect }: CategoryGridProps) => {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Shop by Category</h2>
            <p className="text-muted-foreground mt-1">Browse our wide range of products</p>
          </div>
          {selectedCategory && (
            <button
              onClick={() => onCategorySelect(null)}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors underline-offset-2 hover:underline"
            >
              View All
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(selectedCategory === category.id ? null : category.id)}
              className={`group p-4 rounded-2xl transition-all duration-300 animate-slide-up ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-card-hover scale-[1.02]"
                  : `${category.color} hover:shadow-card-hover hover:scale-[1.02]`
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="text-3xl md:text-4xl mb-2 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <p className={`font-medium text-sm leading-tight ${
                selectedCategory === category.id ? "text-primary-foreground" : "text-foreground"
              }`}>
                {category.name}
              </p>
              <p className={`text-xs mt-1 font-hindi ${
                selectedCategory === category.id ? "text-primary-foreground/80" : "text-muted-foreground"
              }`}>
                {category.nameHindi}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
