import categories from "../data/categories";
import CategoryCard from "./CategoryCard";

function Categories() {
  return (
    <section className="categories">

      <h2>Popular Categories</h2>

      <p className="section-text">
        Browse skilled professionals by trade.
      </p>

      <div className="category-grid">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
          />
        ))}
      </div>

    </section>
  );
}

export default Categories;