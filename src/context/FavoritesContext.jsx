import { createContext, useState } from "react";

export const FavoritesContext = createContext();

function FavoritesProvider({ children }) {

    const [favorites, setFavorites] = useState([]);

    function toggleFavorite(artisan) {

        const exists = favorites.find(item => item.id === artisan.id);

        if (exists) {

            setFavorites(
                favorites.filter(item => item.id !== artisan.id)
            );

        } else {

            setFavorites([...favorites, artisan]);

        }

    }

    return (

        <FavoritesContext.Provider
            value={{
                favorites,
                toggleFavorite
            }}
        >

            {children}

        </FavoritesContext.Provider>

    );

}

export default FavoritesProvider;