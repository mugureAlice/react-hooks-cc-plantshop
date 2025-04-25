
import React, { useState, useEffect } from "react";
import NewPlantForm from "./NewPlantForm";
import PlantList from "./PlantList";
import Search from "./Search";

function PlantPage() {
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:6001/plants")
      .then(res => res.json())
      .then(data => {
        const plantsWithStatus = data.map(plant => ({
          ...plant,
          isSoldOut: plant.price === 0
        }));
        setPlants(plantsWithStatus);
      });
  }, []);

  const handleAddPlant = (newPlant) => {
    setPlants([...plants, { ...newPlant, isSoldOut: false }]);
  };

  const handleToggleSoldOut = (plantId) => {
    setPlants(plants.map(plant => {
      if (plant.id === plantId) {
        const newPrice = plant.isSoldOut ? plant.originalPrice : 0;
        fetch(`http://localhost:6001/plants/${plantId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ price: newPrice })
        });
        return { ...plant, price: newPrice, isSoldOut: !plant.isSoldOut };
      }
      return plant;
    }));
  };

  const filteredPlants = plants.filter(plant =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main>
      <NewPlantForm onAddPlant={handleAddPlant} />
      <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <PlantList plants={filteredPlants} onToggleSoldOut={handleToggleSoldOut} />
    </main>
  );
}

export default PlantPage;