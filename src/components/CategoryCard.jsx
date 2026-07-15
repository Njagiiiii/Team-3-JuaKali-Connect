import { Link } from "react-router-dom";


function CategoryCard({category}) {

    return (

        <div className="category-card">


            <img 
                src={category.image}
                alt={category.name}
            />


            <h3>
                {category.name}
            </h3>


            <p>
                {category.description}
            </p>


            <Link

    to={`/categories/${category.slug}`}

    className="btn-primary"

>

    View

</Link>


        </div>

    );

}


export default CategoryCard;