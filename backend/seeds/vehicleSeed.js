import mongoose from 'mongoose';
import Vehicle from '../models/Vehicle.js';

const sampleVehicles = [
  {
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 25000,
    mileage: 15000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: 2.5,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'A reliable and comfortable sedan with excellent fuel efficiency and modern features.',
    features: ['Air Conditioning', 'Sunroof', 'Leather Seats', 'Navigation System', 'Bluetooth Connectivity', 'Backup Camera']
  },
  {
    make: 'Honda',
    model: 'Civic',
    year: 2023,
    price: 22000,
    mileage: 5000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    engineCapacity: 1.5,
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Sporty and efficient compact car with responsive handling and advanced safety features.',
    features: ['Air Conditioning', 'Sunroof', 'Sport Seats', 'Apple CarPlay', 'Android Auto', 'Lane Departure Warning']
  },
  {
    make: 'Ford',
    model: 'Mustang',
    year: 2021,
    price: 35000,
    mileage: 25000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    engineCapacity: 5.0,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Classic American muscle car with powerful performance and iconic design.',
    features: ['Air Conditioning', 'Leather Seats', 'Navigation System', 'Premium Sound System', 'Sport Suspension']
  },
  {
    make: 'BMW',
    model: 'X5',
    year: 2022,
    price: 65000,
    mileage: 12000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    engineCapacity: 3.0,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Luxury SUV with premium comfort and powerful performance.',
    features: ['Air Conditioning', 'Panoramic Sunroof', 'Premium Leather', 'Navigation System', 'Premium Sound System', '360° Camera']
  },
  {
    make: 'Mercedes',
    model: 'C-Class',
    year: 2023,
    price: 45000,
    mileage: 3000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: 2.0,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Elegant luxury sedan with advanced technology and comfortable ride.',
    features: ['Air Conditioning', 'Sunroof', 'Premium Leather', 'Navigation System', 'Premium Sound System', 'Driver Assistance Package']
  },
  {
    make: 'Audi',
    model: 'A4',
    year: 2022,
    price: 40000,
    mileage: 18000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: 2.0,
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Sporty luxury sedan with quattro all-wheel drive and premium features.',
    features: ['Air Conditioning', 'Sunroof', 'Leather Seats', 'Navigation System', 'Premium Sound System', 'Quattro AWD']
  },
  {
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    price: 55000,
    mileage: 2000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    engineCapacity: 0,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Modern electric vehicle with cutting-edge technology and impressive range.',
    features: ['Air Conditioning', 'Glass Roof', 'Premium Interior', 'Autopilot', 'Premium Sound System', 'Over-the-air Updates']
  },
  {
    make: 'Toyota',
    model: 'RAV4',
    year: 2022,
    price: 30000,
    mileage: 20000,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    engineCapacity: 2.5,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Popular SUV with hybrid powertrain for excellent fuel efficiency.',
    features: ['Air Conditioning', 'Sunroof', 'Leather Seats', 'Navigation System', 'Bluetooth Connectivity', 'Safety Package']
  },
  {
    make: 'Honda',
    model: 'CR-V',
    year: 2023,
    price: 28000,
    mileage: 8000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: 1.5,
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Reliable SUV with spacious interior and excellent safety features.',
    features: ['Air Conditioning', 'Sunroof', 'Leather Seats', 'Navigation System', 'Bluetooth Connectivity', 'Honda Sensing']
  },
  {
    make: 'Ford',
    model: 'F-150',
    year: 2022,
    price: 45000,
    mileage: 15000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    engineCapacity: 3.0,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Powerful pickup truck with impressive towing capacity and modern features.',
    features: ['Air Conditioning', 'Sunroof', 'Leather Seats', 'Navigation System', 'Premium Sound System', 'Towing Package']
  }
];

const seedVehicles = async () => {
  try {
    // Clear existing vehicles
    await Vehicle.deleteMany({});
    
    // Insert sample vehicles
    await Vehicle.insertMany(sampleVehicles);
    
    console.log('Vehicle seed data inserted successfully');
  } catch (error) {
    console.error('Error seeding vehicles:', error);
  }
};

export default seedVehicles; 