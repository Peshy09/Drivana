import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getVehicles } from '../services/VehicleService';
import './styles/VehicleList.css';
import { FaSearch, FaFilter, FaCar, FaGasPump, FaCog, FaTachometerAlt, FaArrowLeft } from 'react-icons/fa';


const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: '',
    priceRange: [],
    brand: [],
    year: [],
    mileage: [],
    fuelType: [],
    transmission: [],
    page: 1,
    limit: 12
  });
  const navigate = useNavigate();

  // Sample vehicle data (18 cars)
  const sampleVehicles = [
      {
        _id: '1',
        make: 'Volvo',
        model: 'XC60',
        year: 2023,
        price: 48000,
        mileage: 4000,
        fuelType: 'Diesel',
        transmission: 'Automatic',
        engineCapacity: 2.0,
        image: '/images/volvo.jpg',
        description: 'Luxury SUV known for safety and comfort'
      },
      {
        _id: '2',
        make: 'Lexus',
        model: 'LX',
        year: 2023,
        price: 80000,
        mileage: 5000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 5.7,
        image: '/images/lexus.png',
        description: 'Luxury SUV with a blend of performance and comfort'
      },
      {
        _id: '3',
        make: 'Mazda',
        model: 'CX-5',
        year: 2023,
        price: 35000,
        mileage: 8000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 2.5,
        image: '/images/mazda.jpg',
        description: 'Compact SUV with excellent handling and fuel efficiency'
      },
      {
        _id: '4',
        make: 'Toyota',
        model: 'Land Cruiser',
        year: 2023,
        price: 70000,
        mileage: 12000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 4.6,
        image: '/images/toyota.jpg',
        description: 'Rugged SUV known for its reliability and off-road capabilities'
      },
      {
        _id: '5',
        make: 'Jeep',
        model: 'Grand Cherokee Laredo',
        year: 2023,
        price: 38000,
        mileage: 15000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 3.6,
        image: '/images/grand.jpg',
        description: 'Midsize SUV with a comfortable interior and off-road prowess'
      },
      {
        _id: '6',
        make: 'Jaguar',
        model: 'F-Pace',
        year: 2023,
        price: 65000,
        mileage: 3000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 3.0,
        image: '/images/jaguar.jpg',
        description: 'Luxury sports car with a powerful supercharged V6 engine'
      },
      {
        _id: '7',
        make: 'Maruti',
        model: 'Fronx',
        year: 2023,
        price: 28000,
        mileage: 3000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 1.5,
        image: '/images/maruti.jpg',
        description: 'Compact SUV with a stylish design and advanced technology'
      },
      {
        _id: '8',
        make: 'Mahindra',
        model: 'Bolero Neo',
        year: 2023,
        price: 20000,
        mileage: 4000,
        fuelType: 'Diesel',
        transmission: 'Manual',
        engineCapacity: 2.2,
        image: '/images/mahindra.png',
        description: 'Rugged and reliable off-road vehicle'
      },
      {
        _id: '9',
        make: 'Jeep',
        model: 'Wrangler',
        year: 2023,
        price: 30000,
        mileage: 5000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 3.6,
        image: '/images/wrangler.jpg',
        description: 'Iconic off-road SUV with a powerful engine'
      },
      {
        _id: '10',
        make: 'Bentley',
        model: 'Bentayga',
        year: 2023,
        price: 180000,
        mileage: 6000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 6.0,
        image: '/images/bentley.jpg',
        description: 'Luxury SUV with a powerful W12 engine'
      },
      {
        _id: '11',
        make: 'Ford',
        model: 'Endeavour',
        year: 2023,
        price: 45000,
        mileage: 7000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 2.0,
        image: '/images/ford.jpg',
        description: 'Midsize SUV with a comfortable ride and advanced safety features'
      },
      {
        _id: '12',
        make: 'Audi',
        model: 'Q7',
        year: 2023,
        price: 55000,
        mileage: 8000,
        fuelType: 'Diesel',
        transmission: 'Automatic',
        engineCapacity: 3.0,
        image: '/images/audi.jpg',
        description: 'Luxury SUV with a blend of performance and luxury'
      },
      {
        _id: '13',
        make: 'BMW',
        model: 'M5',
        year: 2023,
        price: 65000,
        mileage: 9000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 4.4,
        image: '/images/bmw.jpg',
        description: 'High-performance luxury sedan with advanced technology'
      },
      {
        _id: '14',
        make: 'Porsche',
        model: 'Cayenne Platinum',
        year: 2023,
        price: 115000,
        mileage: 11000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 3.0,
        image: '/images/porsche.jpeg',
        description: 'Luxury SUV with a powerful engine and advanced features'
      },
      {
        _id: '15',
        make: 'Renault',
        model: 'Kiger',
        year: 2023,
        price: 25000,
        mileage: 3000,
        fuelType: 'Petrol',
        transmission: 'Manual',
        engineCapacity: 1.6,
        image: '/images/kiger.jpg',
       description: 'Compact SUV with a powerful engine and advanced features'
      },
      {
        _id: '16',
        make: 'Skoda',
        model: 'Kylaq',
        year: 2023,
        price: 30000,
        mileage: 5000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 2.0,
        image: '/images/skoda.jpeg',
        description: 'Midsize SUV with a comfortable ride and advanced safety features'
      },
      {
        _id: '17',
        make: 'MG',
        model: 'Astor',
        year: 2023,
        price: 15000,
        mileage: 15000,
        fuelType: 'Petrol',
        transmission: 'Manual',
        engineCapacity: 1.5,
        image: '/images/astor.jpg',
        description: 'Stylish and sporty compact SUV'
      },
      {
        _id: '18',
        make: 'Tata',
        model: 'Nexon',
        year: 2023,
        price: 18000,
        mileage: 7000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 1.2,
        image: '/images/tata.jpg',
        description: 'Compact SUV with a spacious interior and efficient engine'
      }
    ];

  useEffect(() => {
    // For demo purposes, we'll use the sample data instead of API call
    setVehicles(sampleVehicles);
    setLoading(false);
  }, []);

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setFilters(prev => ({ ...prev, searchTerm }));
    
    // Filter vehicles based on search term
    if (searchTerm.trim() === '') {
      setVehicles(sampleVehicles);
    } else {
      const filtered = sampleVehicles.filter(vehicle => 
        `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setVehicles(filtered);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const VehicleCard = ({ vehicle }) => {
    return (
      <div className="vehicle-card">
        <div className="vehicle-image-container">
          <img src={vehicle.image} alt={`${vehicle.make} ${vehicle.model}`} className="vehicle-image" />
        </div>
        <div className="vehicle-info">
          <h3 className="vehicle-title">{vehicle.make} {vehicle.model}</h3>
          <p className="vehicle-price">{formatPrice(vehicle.price)}</p>
          <div className="vehicle-specs">
            <div className="spec-item"><FaCar /> {vehicle.year}</div>
            <div className="spec-item"><FaTachometerAlt /> {vehicle.mileage.toLocaleString()} mi</div>
            <div className="spec-item"><FaGasPump /> {vehicle.fuelType}</div>
            <div className="spec-item"><FaCog /> {vehicle.transmission}</div>
          </div>
          <button
            className="view-details-btn"
            onClick={() => navigate(`/vehicleDetails/${vehicle._id}`)} // Ensure this matches the route in App.jsx
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="vehicle-list-container">
      <div className="vehicle-list-content">
        <div className="back-button" onClick={() => navigate('/')}>
          <FaArrowLeft /> Back to Home
        </div>
        <div className="search-filter-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={filters.searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <button className="filter-button">
            <FaFilter /> Filters
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="vehicle-grid">
            {vehicles.map(vehicle => (
             <VehicleCard key={vehicle._id} vehicle={vehicle} />           
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleList;