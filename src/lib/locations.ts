import type { Location } from '../types'

/**
 * Static landmark list. Any entry can be the daily answer (map centers on it)
 * or a player's guess (haversine distance), so every coordinate must be
 * accurate. Keep one entry per line.
 */
export const LOCATIONS: Location[] = [
  { name: 'Eiffel Tower', lat: 48.8584, lng: 2.2945, country: 'France', continent: 'Europe', difficulty: 'easy' },
  { name: 'Statue of Liberty', lat: 40.6892, lng: -74.0445, country: 'United States', continent: 'North America', difficulty: 'easy' },
  { name: 'Colosseum', lat: 41.8902, lng: 12.4922, country: 'Italy', continent: 'Europe', difficulty: 'easy' },
  { name: 'Great Pyramid of Giza', lat: 29.9792, lng: 31.1342, country: 'Egypt', continent: 'Africa', difficulty: 'easy' },
  { name: 'Sydney Opera House', lat: -33.8568, lng: 151.2153, country: 'Australia', continent: 'Oceania', difficulty: 'easy' },
  { name: 'Big Ben', lat: 51.5007, lng: -0.1246, country: 'United Kingdom', continent: 'Europe', difficulty: 'easy' },
  { name: 'Taj Mahal', lat: 27.1751, lng: 78.0421, country: 'India', continent: 'Asia', difficulty: 'easy' },
  { name: 'Christ the Redeemer', lat: -22.9519, lng: -43.2105, country: 'Brazil', continent: 'South America', difficulty: 'easy' },
  { name: 'Golden Gate Bridge', lat: 37.8199, lng: -122.4783, country: 'United States', continent: 'North America', difficulty: 'easy' },
  { name: 'Burj Khalifa', lat: 25.1972, lng: 55.2744, country: 'United Arab Emirates', continent: 'Asia', difficulty: 'easy' },
  { name: 'Machu Picchu', lat: -13.1631, lng: -72.545, country: 'Peru', continent: 'South America', difficulty: 'medium' },
  { name: 'Great Wall at Badaling', lat: 40.3565, lng: 116.0078, country: 'China', continent: 'Asia', difficulty: 'medium' },
  { name: 'Stonehenge', lat: 51.1789, lng: -1.8262, country: 'United Kingdom', continent: 'Europe', difficulty: 'medium' },
  { name: 'Mount Fuji', lat: 35.3606, lng: 138.7274, country: 'Japan', continent: 'Asia', difficulty: 'medium' },
  { name: 'Petra', lat: 30.3285, lng: 35.4444, country: 'Jordan', continent: 'Asia', difficulty: 'medium' },
  { name: 'Sagrada Família', lat: 41.4036, lng: 2.1744, country: 'Spain', continent: 'Europe', difficulty: 'medium' },
  { name: 'Leaning Tower of Pisa', lat: 43.723, lng: 10.3966, country: 'Italy', continent: 'Europe', difficulty: 'medium' },
  { name: 'Brandenburg Gate', lat: 52.5163, lng: 13.3777, country: 'Germany', continent: 'Europe', difficulty: 'medium' },
  { name: 'Acropolis of Athens', lat: 37.9715, lng: 23.7257, country: 'Greece', continent: 'Europe', difficulty: 'medium' },
  { name: 'Angkor Wat', lat: 13.4125, lng: 103.867, country: 'Cambodia', continent: 'Asia', difficulty: 'medium' },
  { name: 'Table Mountain', lat: -33.9628, lng: 18.4098, country: 'South Africa', continent: 'Africa', difficulty: 'medium' },
  { name: 'Niagara Falls', lat: 43.0799, lng: -79.0747, country: 'Canada', continent: 'North America', difficulty: 'medium' },
  { name: 'Chichen Itza', lat: 20.6843, lng: -88.5678, country: 'Mexico', continent: 'North America', difficulty: 'hard' },
  { name: 'Hagia Sophia', lat: 41.0086, lng: 28.9802, country: 'Turkey', continent: 'Europe', difficulty: 'hard' },
  { name: 'Easter Island Moai', lat: -27.1257, lng: -109.2769, country: 'Chile', continent: 'South America', difficulty: 'hard' },
  { name: 'Uluru', lat: -25.3444, lng: 131.0369, country: 'Australia', continent: 'Oceania', difficulty: 'hard' },
  { name: 'Neuschwanstein Castle', lat: 47.5576, lng: 10.7498, country: 'Germany', continent: 'Europe', difficulty: 'hard' },
  { name: 'Forbidden City', lat: 39.9163, lng: 116.3972, country: 'China', continent: 'Asia', difficulty: 'hard' },
  { name: 'Victoria Falls', lat: -17.9243, lng: 25.8572, country: 'Zimbabwe', continent: 'Africa', difficulty: 'hard' },
  { name: 'Golden Temple', lat: 31.62, lng: 74.8765, country: 'India', continent: 'Asia', difficulty: 'hard' },
]
