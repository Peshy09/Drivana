import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/VehicleDetail.css';
import { FaArrowLeft, FaCar, FaGasPump, FaCog, FaTachometerAlt, FaRoad, FaCalendarAlt, FaCarBattery } from 'react-icons/fa';

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vehicle details mapping
  const vehicleDetailsMap = {
    // Volvo XC60
    '1': {
      make: 'Volvo',
      model: 'XC60',
      year: 2023,
      price: 48000,
      mileage: 4000,
      fuelType: 'Diesel',
      transmission: 'Automatic',
      engineCapacity: 2.0,
      images: [
        '/images/volvo.jpg',
        '/images/volvo-interior.jpg',
        '/images/volvo-rear.jpg',
        '/images/volvo-side.jpg'
      ],
      description: 'The Volvo XC60 exemplifies Scandinavian luxury and safety. This premium SUV combines elegant design with advanced safety features and comfortable driving dynamics, making it perfect for both urban commuting and long-distance travel.',
      specifications: {
        engine: '2.0L 4-cylinder Twin-Turbo',
        power: '250 hp',
        torque: '350 Nm',
        acceleration: '0-100 km/h in 6.9 seconds',
        topSpeed: '220 km/h',
        fuelTank: '71 L',
        groundClearance: '216 mm',
        seatingCapacity: '5',
        bootSpace: '505 L',
        dimensions: '4,688 mm L x 1,902 mm W x 1,658 mm H'
      },
      features: [
        'Sensus Navigation System',
        'Premium Leather Upholstery',
        'Panoramic Sunroof',
        '9-inch Touchscreen Display',
        'Harman Kardon Premium Sound',
        'Four-zone Climate Control',
        'Power Tailgate',
        'LED Headlights with Active Bending'
      ],
      safetyFeatures: [
        'City Safety with Autobrake',
        'Pilot Assist',
        'Blind Spot Information System',
        'Cross Traffic Alert',
        'Run-off Road Protection',
        '7 Airbags'
      ]
    },

    // Lexus LX
    '2': {
      make: 'Lexus',
      model: 'LX',
      year: 2023,
      price: 80000,
      mileage: 5000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      engineCapacity: 5.7,
      images: [
        '/images/lexus.png',
        '/images/lexus-interior.jpg',
        '/images/lexus-rear.jpg',
        '/images/lexus-side.jpg'
      ],
      description: 'The Lexus LX represents the pinnacle of luxury SUV craftsmanship. This flagship model combines unmatched comfort with exceptional off-road capability, featuring advanced technology and premium materials throughout.',
      specifications: {
        engine: '5.7L V8',
        power: '409 hp',
        torque: '650 Nm',
        acceleration: '0-100 km/h in 6.4 seconds',
        topSpeed: '210 km/h',
        fuelTank: '93 L',
        groundClearance: '225 mm',
        seatingCapacity: '7',
        bootSpace: '1,276 L',
        dimensions: '5,130 mm L x 1,980 mm W x 1,890 mm H'
      },
      features: [
        'Mark Levinson Reference Audio',
        'Semi-aniline Leather Seats',
        'Cool Box',
        '12.3-inch Touchscreen',
        'Rear Seat Entertainment',
        'Quad-zone Climate Control',
        'Power-folding Third Row',
        'Adaptive Variable Suspension'
      ],
      safetyFeatures: [
        'Lexus Safety System+',
        'Pre-Collision System',
        'All-Speed Dynamic Radar Cruise Control',
        'Lane Tracing Assist',
        'Multi-Terrain Monitor',
        '10 Airbags'
      ]
    },

    // Mazda CX-5
    '3': {
      make: 'Mazda',
      model: 'CX-5',
      year: 2023,
      price: 35000,
      mileage: 8000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      engineCapacity: 2.5,
      images: [
        '/images/mazda.jpg',
        '/images/mazda-interior.jpg',
        '/images/mazda-rear.jpg',
        '/images/mazda-side.jpg'
      ],
      description: 'The Mazda CX-5 delivers an upscale experience with its refined handling and premium interior. It stands out in its class with sophisticated styling and engaging driving dynamics that make every journey enjoyable.',
      specifications: {
        engine: '2.5L Skyactiv-G',
        power: '187 hp',
        torque: '252 Nm',
        acceleration: '0-100 km/h in 8.8 seconds',
        topSpeed: '190 km/h',
        fuelTank: '58 L',
        groundClearance: '193 mm',
        seatingCapacity: '5',
        bootSpace: '442 L',
        dimensions: '4,550 mm L x 1,840 mm W x 1,680 mm H'
      },
      features: [
        'Mazda Connect Infotainment',
        'Bose Premium Audio',
        'Power Moonroof',
        'Heated Front Seats',
        'Apple CarPlay/Android Auto',
        'Dual-zone Climate Control',
        'Power Liftgate',
        'LED Headlights'
      ],
      safetyFeatures: [
        'i-Activsense Safety Suite',
        'Radar Cruise Control',
        'Lane Departure Warning',
        'Smart Brake Support',
        'Driver Attention Alert',
        '6 Airbags'
      ]
    },

    // Toyota Land Cruiser
    '4': {
      make: 'Toyota',
      model: 'Land Cruiser',
      year: 2023,
      price: 70000,
      mileage: 12000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      engineCapacity: 4.6,
      images: [
        '/images/toyota.jpg',
        '/images/toyota-interior.jpg',
        '/images/toyota-rear.jpg',
        '/images/toyota-side.jpg'
      ],
      description: 'The Toyota Land Cruiser is the ultimate expression of luxury and capability. It combines off-road prowess with premium comfort.',
      specifications: {
        engine: '4.6L V8',
        power: '318 hp',
        torque: '460 Nm',
        acceleration: '0-100 km/h in 7.5 seconds',
        topSpeed: '200 km/h',
        fuelTank: '93 L',
        groundClearance: '225 mm',
        seatingCapacity: '7',
        bootSpace: '1,267 L',
        dimensions: '4,950 mm L x 1,980 mm W x 1,945 mm H'
      },
      features: [
        'Multi-terrain Select',
        'Kinetic Dynamic Suspension',
        'Premium Leather Seats',
        'JBL Sound System',
        'Wireless Charging',
        'Cooled Center Console',
        'Four-zone Climate Control',
        'Moonroof'
      ],
      safetyFeatures: [
        'Toyota Safety Sense',
        'Pre-Collision System',
        'Dynamic Radar Cruise Control',
        'Lane Departure Alert',
        'Multi-Terrain Monitor',
        '10 Airbags'
      ]
    },
      '5': {
        make: 'Jeep',
        model: 'Grand Cherokee Laredo',
        year: 2023,
        price: 38000,
        mileage: 15000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 3.6,
        images: [
          '/images/jeep.jpg',
          '/images/jeep-interior.jpg',
          '/images/jeep-rear.jpg',
          '/images/jeep-side.jpg'
        ],
        description: 'A midsize SUV with a comfortable interior and off-road prowess.',
        specifications: {
          engine: '3.6L V6',
          power: '293 hp',
          torque: '260 lb-ft',
          acceleration: '0-60 mph in 7.3 seconds',
          topSpeed: '120 mph',
          fuelTank: '21.5 gallons',
          groundClearance: '8.3 inches',
          seatingCapacity: '5',
          bootSpace: '68.7 cubic feet',
          dimensions: '189.0 inches L x 73.1 inches W x 68.2 inches H'
        },
        features: [
          ' Selec-Terrain Traction Control',
          'Hill-Start Assist',
          'Power Liftgate',
          'Uconnect 8.4 Touchscreen',
          'Apple CarPlay/Android Auto',
          'Heated Front Seats',
          'LED Headlights'
        ],
        safetyFeatures: [
          'Advanced Multistage Front Airbags',
          'Supplemental Front Seat-Mounted Side Airbags',
          'Side Curtain Airbags',
          'Electronic Stability Control',
          'Anti-lock Brake System',
          'All-Speed Traction Control',
          'Blind-Spot Monitoring'
        ]
      },
      '6': {
        make: 'Jaguar',
        model: 'F-Pace',
        year: 2023,
        price: 65000,
        mileage: 3000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 3.0,
        images: [
          '/images/jaguar.jpg',
          '/images/jaguar-interior.jpg',
          '/images/jaguar-rear.jpg',
          '/images/jaguar-side.jpg'
        ],
        description: 'A luxury sports car with a powerful supercharged V6 engine.',
        specifications: {
          engine: '3.0L Supercharged V6',
          power: '380 hp',
          torque: '350 lb-ft',
          acceleration: '0-60 mph in 5.1 seconds',
          topSpeed: '170 mph',
          fuelTank: '19.4 gallons',
          groundClearance: '5.9 inches',
          seatingCapacity: '4',
          bootSpace: '14.4 cubic feet',
          dimensions: '183.5 inches L x 74.9 inches W x 54.8 inches H'
        },
        features: [
          'InControl Dynamic Stability Control',
          'Torque Vectoring Control',
          'Quick Ratio Transfer Case',
          'JaguarDrive All-Wheel Drive',
          'Meridian Sound System',
          'Heated and Ventilated Seats',
          'Power Moonroof',
          'LED Headlights'
        ],
        safetyFeatures: [
          'Emergency Braking System',
          'Electronic Traction Control',
          'Roll Stability Control',
          'Traction Control System',
          'Dynamic Stability Control',
          'All-Speed Traction Control',
          'Blind-Spot Monitoring'
        ]
      },
      '7': {
        make: 'Maruti',
        model: 'Fronx',
        year: 2023,
        price: 28000,
        mileage: 3000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 1.5,
        images: [
          '/images/maruti.jpg',
          '/images/maruti-interior.jpg',
          '/images/maruti-rear.jpg',
          '/images/maruti-side.jpg'
        ],
        description: 'A compact SUV with a stylish design and advanced technology.',
        specifications: {
          engine: '1.5L 4-cylinder',
          power: '181 hp',
          torque: '177 lb-ft',
          acceleration: '0-60 mph in 8.0 seconds',
          topSpeed: '125 mph',
          fuelTank: '12.4 gallons',
          groundClearance: '7.9 inches',
          seatingCapacity: '5',
          bootSpace: '22.8 cubic feet',
          dimensions: '172.4 inches L x 70.9 inches W x 65.3 inches H'
        },
        features: [
          'Apple CarPlay/Android Auto',
          'Bluetooth Connectivity',
          'Rear View Camera',
          'Push Button Start',
          'Heated Front Seats',
          'Dual-zone Climate Control',
          'Power Moonroof',
          'LED Headlights'
        ],
        safetyFeatures: [
          'Advanced Multistage Front Airbags',
          'Supplemental Front Seat-Mounted Side Airbags',
          'Side Curtain Airbags',
          'Electronic Stability Control',
          'Anti-lock Brake System',
          'All-Speed Traction Control',
          'Blind-Spot Monitoring'
        ]
      },
      '8': {
        make: 'Mahindra',
        model: 'Bolero Neo',
        year: 2023,
        price: 20000,
        mileage: 4000,
        fuelType: 'Diesel',
        transmission: 'Manual',
        engineCapacity: 2.2,
        images: [
          '/images/mahindra.jpg',
          '/images/mahindra-interior.jpg',
          '/images/mahindra-rear.jpg',
          '/images/mahindra-side.jpg'
        ],
        description: 'A rugged and reliable off-road vehicle.',
        specifications: {
          engine: '2.2L 4-cylinder',
          power: '187 hp',
          torque: '332 lb-ft',
          acceleration: '0-60 mph in 9.5 seconds',
          topSpeed: '120 mph',
          fuelTank: '15.3 gallons',
          groundClearance: '8.0 inches',
          seatingCapacity: '7',
          bootSpace: '70 cubic feet',
          dimensions: '189.9 inches L x 73.6 inches W x 70.9 inches H'
        },
        features: [
          'Rock-Trac 4x4',
          'Hill-Start Assist',
          'Power Moonroof',
          'Uconnect 8.4 Touchscreen',
          'Apple CarPlay/Android Auto',
          'Heated Front Seats',
          'Dual-zone Climate Control',
          'Power Liftgate',
          'LED Headlights'
        ],
        safetyFeatures: [
          'Rigid Frame Construction',
          'Advanced Multistage Front Airbags',
          'Supplemental Front Seat-Mounted Side Airbags',
          'Side Curtain Airbags',
          'Electronic Stability Control',
          'Anti-lock Brake System',
          'All-Speed Traction Control',
          'Blind-Spot Monitoring'
        ]
      },
      '9': {
        make: 'Jeep',
        model: 'Wrangler',
        year: 2023,
        price: 30000,
        mileage: 5000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 3.6,
        images: [
          '/images/jeep.jpg',
          '/images/jeep-interior.jpg',
          '/images/jeep-rear.jpg',
          '/images/jeep-side.jpg'
        ],
        description: 'Iconic off-road SUV with a powerful engine.',
        specifications: {
          engine: '3.6L Pentastar V6',
          power: '285 hp',
          torque: '260 lb-ft',
          acceleration: '0-60 mph in 7.1 seconds',
          topSpeed: '115 mph',
          fuelTank: '21.5 gallons',
          groundClearance: '10.8 inches',
          seatingCapacity: '4',
          bootSpace: '31.7 cubic feet',
          dimensions: '174.2 inches L x 73.8 inches W x 69.8 inches H'
        },
        features: [
          ' Selec-Terrain Traction Control',
          'Rock-Trac 4x4',
          'Hill-Start Assist',
          'Quick Ratio Transfer Case',
          'JaguarDrive All-Wheel Drive',
          'Meridian Sound System',
          'Heated and Ventilated Seats',
          'Power Moonroof',
          'LED Headlights'
        ],
        safetyFeatures: [
          'Electronic Stability Control',
          'Anti-lock Brake System',
          'All-Speed Traction Control',
          'Blind-Spot Monitoring',
          'Advanced Multistage Front Airbags',
          'Supplemental Front Seat-Mounted Side Airbags',
          'Side Curtain Airbags'
        ]
      },
      '10': {
        make: 'Bentley',
        model: 'Bentayga',
        year: 2023,
        price: 180000,
        mileage: 6000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 6.0,
        images: [
          '/images/bentley.jpg',
          '/images/bentley-interior.jpg',
          '/images/bentley-rear.jpg',
          '/images/bentley-side.jpg'
        ],
        description: 'Luxury SUV with a powerful W12 engine.',
        specifications: {
          engine: '6.0L W12',
          power: '600 hp',
          torque: '664 lb-ft',
          acceleration: '0-60 mph in 4.5 seconds',
          topSpeed: '190 mph',
          fuelTank: '22.4 gallons',
          groundClearance: '8.2 inches',
          seatingCapacity: '4',
          bootSpace: '17 cubic feet',
          dimensions: '198.3 inches L x 78.7 inches W x 68.2 inches H'
        },
        features: [
          'Bentley Dynamic Riding Mode',
          'Torque Vectoring Control',
          'Quick Ratio Transfer Case',
          'Bentley All-Wheel Drive',
          'Naim Audio',
          'Heated and Ventilated Seats',
          'Power Moonroof',
          'LED Headlights'
        ],
        safetyFeatures: [
          'Electronic Stability Control',
          'Anti-lock Brake System',
          'All-Speed Traction Control',
          'Blind-Spot Monitoring',
          'Advanced Multistage Front Airbags',
          'Supplemental Front Seat-Mounted Side Airbags',
          'Side Curtain Airbags'
        ]
      },
      '11': {
        make: 'Ford',
        model: 'Endeavour',
        year: 2023,
        price: 45000,
        mileage: 7000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 2.0,
        images: [
          '/images/ford.jpg',
          '/images/ford-interior.jpg',
          '/images/ford-rear.jpg',
          '/images/ford-side.jpg'
        ],
        description: 'Midsize SUV with a comfortable ride and advanced safety features.',
        specifications: {
          engine: '2.0L EcoBoost',
          power: '250 hp',
          torque: '280 lb-ft',
          acceleration: '0-60 mph in 6.8 seconds',
          topSpeed: '130 mph',
          fuelTank: '18.5 gallons',
          groundClearance: '8.2 inches',
          seatingCapacity: '5',
          bootSpace: '68 cubic feet',
          dimensions: '189.0 inches L x 74.9 inches W x 68.8 inches H'
        },
        features: [
          'SYNC 3 Infotainment System',
          'SiriusXM Satellite Radio',
          'Heated Front Seats',
          'Power Moonroof',
          'LED Headlights',
          'Dual-zone Climate Control',
          'Power Liftgate'
        ],
        safetyFeatures: [
          'Co-Pilot360',
          'Pre-Collision Assist',
          'Blind Spot Information System',
          'Lane Keeping System',
          'Adaptive Cruise Control',
          '7 Airbags'
        ]
      },
      '12': {
        make: 'Audi',
        model: 'Q7',
        year: 2023,
        price: 55000,
        mileage: 8000,
        fuelType: 'Diesel',
        transmission: 'Automatic',
        engineCapacity: 3.0,
        images: [
          '/images/audi.jpg',
          '/images/audi-interior.jpg',
          '/images/audi-rear.jpg',
          '/images/audi-side.jpg'
        ],
        description: 'Luxury SUV with a blend of performance and luxury.',
        specifications: {
          engine: '3.0L TDI',
          power: '333 hp',
          torque: '428 lb-ft',
          acceleration: '0-60 mph in 5.9 seconds',
          topSpeed: '135 mph',
          fuelTank: '22.5 gallons',
          groundClearance: '8.3 inches',
          seatingCapacity: '7',
          bootSpace: '76 cubic feet',
          dimensions: '196.8 inches L x 78.3 inches W x 67.7 inches H'
        },
        features: [
          'Virtual Cockpit 360',
          'MMI Touch Response',
          'Bang & Olufsen Sound System',
          'Panoramic Sunroof',
          'Rear Seat Entertainment',
          'Quad-zone Climate Control',
          'Power-folding Third Row',
          'Adaptive Variable Suspension'
        ],
        safetyFeatures: [
          'Audi Pre Sense Front',
          'Audi Side Assist',
          'Audi Active Lane Assist',
          'Audi Adaptive Cruise Assist',
          'Audi 360',
          '8 Airbags'
        ]
      },
      '13': {
        make: 'BMW',
        model: 'M5',
        year: 2023,
        price: 65000,
        mileage: 9000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 4.4,
        images: [
          '/images/bmw.jpg',
          '/images/bmw-interior.jpg',
          '/images/bmw-rear.jpg',
          '/images/bmw-side.jpg'
        ],
        description: 'High-performance luxury sedan with advanced technology.',
        specifications: {
          engine: '4.4L TwinPower Turbo',
          power: '523 hp',
          torque: '553 lb-ft',
          acceleration: '0-60 mph in 3.8 seconds',
          topSpeed: '155 mph',
          fuelTank: '18.7 gallons',
          groundClearance: '4.7 inches',
          seatingCapacity: '5',
          bootSpace: '18 cubic feet',
          dimensions: '196.2 inches L x 72.6 inches W x 57.6 inches H'
        },
        features: [
          'iDrive',
          'Harman/Kardon Surround Sound System',
          'Panoramic Sunroof',
          'Heated Front Seats',
          '12.3-inch Touchscreen',
          'Rear Seat Entertainment',
          'Quad-zone Climate Control',
          'Power Moonroof',
          'LED Headlights'
        ],
        safetyFeatures: [
          'Active Protection',
          'Frontal Collision Warning',
          'City Collision Mitigation',
          'Pedestrian Detection',
          'Blind Spot Information System',
          'Lane Departure Warning',
          '8 Airbags'
        ]
      },
      '14': {
        make: 'Porsche',
        model: 'Cayenne Platinum',
        year: 2023,
        price: 115000,
        mileage: 11000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 3.0,
        images: [
          '/images/porsche.jpg',
          '/images/porsche-interior.jpg',
          '/images/porsche-rear.jpg',
          '/images/porsche-side.jpg'
        ],
        description: 'Luxury SUV with a powerful engine and advanced features.',
        specifications: {
          engine: '3.0L V6',
          power: '335 hp',
          torque: '332 lb-ft',
          acceleration: '0-60 mph in 5.2 seconds',
          topSpeed: '157 mph',
          fuelTank: '21 gallons',
          groundClearance: '8.1 inches',
          seatingCapacity: '5',
          bootSpace: '26 cubic feet',
          dimensions: '194.3 inches L x 76.8 inches W x 66.3 inches H'
        },
        features: [
          'Porsche Active Suspension Management',
          'Porsche Traction Control',
          'Bose Surround Sound System',
          'Panoramic Sunroof',
          'Rear Seat Entertainment',
          '14-way Power Seats',
          'Dual-zone Climate Control',
          'Power Moonroof',
          'LED Headlights'
        ],
        safetyFeatures: [
          'Porsche Personal CoPilot',
          'Porsche Side Impact Protection',
          'Porsche Active Safeguard',
          'Blind Spot Information System',
          'Lane Keeping Assist',
          'Adaptive Cruise Control',
          '7 Airbags'
        ]
      },
      '15': {
        make: 'Renault',
        model: 'Kiger',
        year: 2023,
        price: 25000,
        mileage: 3000,
        fuelType: 'Petrol',
        transmission: 'Manual',
        engineCapacity: 1.6,
        images: [
          '/images/renault.jpg',
          '/images/renault-interior.jpg',
          '/images/renault-rear.jpg',
          '/images/renault-side.jpg'
        ],
        description: 'Compact SUV with a powerful engine and advanced features.',
        specifications: {
          engine: '1.6L Turbocharged',
          power: '197 hp',
          torque: '192 lb-ft',
          acceleration: '0-60 mph in 7.6 seconds',
          topSpeed: '130 mph',
          fuelTank: '15.8 gallons',
          groundClearance: '8.1 inches',
          seatingCapacity: '5',
          bootSpace: '21 cubic feet',
          dimensions: '172.4 inches L x 70.1 inches W x 65.7 inches H'
        },
        features: [
          'Multi-Sense System',
          'BOSE Premium Audio',
          'Push Button Start',
          'Rear View Camera',
          'Apple CarPlay/Android Auto',
          'Dual-zone Climate Control',
          'Power Moonroof',
          'LED Headlights'
        ],
        safetyFeatures: [
          'Active Emergency Braking',
          'Electronic Stability Control',
          'All-Speed Dynamic Radar Cruise Control',
          'Lane Tracing Assist',
          'Multi-Terrain Monitor',
          '6 Airbags'
        ]
      },
      '16': {
        make: 'Skoda',
        model: 'Kylaq',
        year: 2023,
        price: 30000,
        mileage: 5000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 2.0,
        images: [
          '/images/skoda.jpg',
          '/images/skoda-interior.jpg',
          '/images/skoda-rear.jpg',
          '/images/skoda-side.jpg'
        ],
        description: 'Midsize SUV with a comfortable ride and advanced safety features.',
        specifications: {
          engine: '2.0L Turbocharged',
          power: '227 hp',
          torque: '258 lb-ft',
          acceleration: '0-60 mph in 7.2 seconds',
          topSpeed: '124 mph',
          fuelTank: '16.9 gallons',
          groundClearance: '8.0 inches',
          seatingCapacity: '7',
          bootSpace: '66 cubic feet',
          dimensions: '184.8 inches L x 72.9 inches W x 66.5 inches H'
        },
        features: [
          'Virtual Cockpit 360',
          'Kodak Infotainment System',
          'Heated Front Seats',
          'Power Moonroof',
          'LED Headlights',
          'Dual-zone Climate Control',
          'Power Liftgate',
          'Apple CarPlay/Android Auto'
        ],
        safetyFeatures: [
          'Skoda Assist 3.0',
          'Frontal Collision Warning',
          'City Collision Mitigation',
          'Pedestrian Detection',
          'Blind Spot Information System',
          'Lane Keeping Assist',
          '9 Airbags'
        ]
      },
      '17': {
        make: 'MG',
        model: 'Astor',
        year: 2023,
        price: 15000,
        mileage: 15000,
        fuelType: 'Petrol',
        transmission: 'Manual',
        engineCapacity: 1.5,
        images: [
          '/images/mg.jpg',
          '/images/mg-interior.jpg',
          '/images/mg-rear.jpg',
          '/images/mg-side.jpg'
        ],
        description: 'Stylish and sporty compact SUV.',
        specifications: {
          engine: '1.5L 3-cylinder',
          power: '148 hp',
          torque: '148 lb-ft',
          acceleration: '0-60 mph in 8.5 seconds',
          topSpeed: '118 mph',
          fuelTank: '12.4 gallons',
          groundClearance: '6.7 inches',
          seatingCapacity: '5',
          bootSpace: '16 cubic feet',
          dimensions: '168.7 inches L x 71.2 inches W x 63.9 inches H'
        },
        features: [
          'MG Connected Infotainment',
          'Bose Premium Audio',
          'Push Button Start',
          'Rear View Camera',
          'Apple CarPlay/Android Auto',
          'Dual-zone Climate Control',
          'Power Moonroof',
          'LED Headlights'
        ],
        safetyFeatures: [
          'i-Activsense Safety Suite',
          'Radar Cruise Control',
          'Lane Departure Warning',
          'Smart Brake Support',
          'Driver Attention Alert',
          '6 Airbags'
        ]
      },
      '18': {
        make: 'Tata',
        model: 'Nexon',
        year: 2023,
        price: 18000,
        mileage: 7000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: 1.2,
        images: [
          '/images/tata.jpg',
          '/images/tata-interior.jpg',
          '/images/tata-rear.jpg',
          '/images/tata-side.jpg'
        ],
        description: 'Compact SUV with a spacious interior and efficient engine.',
        specifications: {
          engine: '1.2L 3-cylinder',
          power: '153 hp',
          torque: '150 lb-ft',
          acceleration: '0-60 mph in 8.9 seconds',
          topSpeed: '120 mph',
          fuelTank: '14.8 gallons',
          groundClearance: '7.9 inches',
          seatingCapacity: '5',
          bootSpace: '56 cubic feet',
          dimensions: '170.9 inches L x 72.8 inches W x 65.7 inches H'
        },
        features: [
          'Tata SmartPilot Assist',
          'Infotainment System',
          'Push Button Start',
          'Rear View Camera',
          'Apple CarPlay/Android Auto',
          'Dual-zone Climate Control',
          'Power Moonroof',
          'LED Headlights'
        ],
        safetyFeatures: [
          'Electronic Stability Control',
          'Anti-lock Brake System',
          'All-Speed Traction Control',
          'Blind-Spot Monitoring',
          'Advanced Multistage Front Airbags',
          'Supplemental Front Seat-Mounted Side Airbags',
          'Side Curtain Airbags'
        ]
      }
    };

    
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ Retrieve token at the start
        console.log("Vehicle ID:", id); // Debugging the ID
        console.log("Token:", token); // Debugging the token

        const response = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Ensure token is sent properly
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response from server:", errorData);
          throw new Error(`Failed to fetch vehicle details: ${response.statusText}`);
        }

        const data = await response.json();
        setVehicle(data);
      } catch (err) {
        console.error("Error fetching vehicle details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) { // Ensure ID is valid before fetching
      fetchVehicleDetails();
    }
  }, [id]);    
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!vehicle) return <div>Vehicle not found</div>;
  
    const formatPrice = (price) => {
      return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    };
  
    return (
      <div className="vehicle-detail-container">
        <div className="vehicle-detail-content">
          <div className="back-button" onClick={() => navigate('/vehicles')}>
            <FaArrowLeft /> Back to Vehicles
          </div>
  
          <div className="vehicle-detail-header">
            <h1>{vehicle.make} {vehicle.model}</h1>
            <p className="vehicle-year">{vehicle.year} Model</p>
            <p className="vehicle-price">{formatPrice(vehicle.price)}</p>
          </div>
  
          <div className="vehicle-gallery">
            <div className="main-image">
              <img src={vehicle.images[0]} alt={`${vehicle.make} ${vehicle.model}`} />
            </div>
            <div className="thumbnail-container">
              {vehicle.images.slice(1).map((image, index) => (
                <div key={index} className="thumbnail">
                  <img src={image} alt={`${vehicle.make} ${vehicle.model} view ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
  
          <div className="vehicle-details-grid">
            <div className="specifications-section">
              <h2>Specifications</h2>
              <div className="specs-grid">
                <div className="spec-item">
                  <FaCar /> Engine
                  <strong>{vehicle.specifications.engine}</strong>
                </div>
                <div className="spec-item">
                  <FaRoad /> Power
                  <strong>{vehicle.specifications.power}</strong>
                </div>
                {/* Add more specification items */}
              </div>
            </div>
  
            <div className="features-section">
              <h2>Key Features</h2>
              <ul className="features-list">
                {vehicle.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
  
            <div className="safety-section">
              <h2>Safety Features</h2>
              <ul className="safety-list">
                {vehicle.safetyFeatures.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
  
          <div className="description-section">
            <h2>Description</h2>
            <p>{vehicle.description}</p>
          </div>
  
          <button className="contact-seller-button">
            Contact Seller
          </button>
        </div>
      </div>
    );
  };
  
  export default VehicleDetail;