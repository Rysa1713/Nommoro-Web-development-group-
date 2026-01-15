// Country and City data for dropdowns
const countryData = {
  "Afghanistan": ["Kabul", "Kandahar", "Herat", "Mazar-i-Sharif", "Jalalabad"],
  "Albania": ["Tirana", "Durrës", "Vlorë", "Shkodër", "Fier"],
  "Algeria": ["Algiers", "Oran", "Constantine", "Annaba", "Blida"],
  "Argentina": ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata"],
  "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Newcastle", "Canberra", "Sunshine Coast", "Wollongong"],
  "Austria": ["Vienna", "Graz", "Linz", "Salzburg", "Innsbruck"],
  "Bangladesh": ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet"],
  "Belgium": ["Brussels", "Antwerp", "Ghent", "Charleroi", "Liège"],
  "Brazil": ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Porto Alegre"],
  "Brunei": ["Bandar Seri Begawan", "Kuala Belait", "Seria", "Tutong", "Bangar"],
  "Cambodia": ["Phnom Penh", "Siem Reap", "Battambang", "Sihanoukville", "Poipet"],
  "Canada": ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg", "Quebec City", "Hamilton", "Kitchener"],
  "Chile": ["Santiago", "Valparaíso", "Concepción", "La Serena", "Antofagasta"],
  "China": ["Shanghai", "Beijing", "Chongqing", "Tianjin", "Guangzhou", "Shenzhen", "Wuhan", "Dongguan", "Chengdu", "Nanjing"],
  "Colombia": ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena"],
  "Denmark": ["Copenhagen", "Aarhus", "Odense", "Aalborg", "Esbjerg"],
  "Egypt": ["Cairo", "Alexandria", "Giza", "Shubra El-Kheima", "Port Said"],
  "Finland": ["Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu"],
  "France": ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille"],
  "Germany": ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf", "Dortmund", "Essen", "Leipzig"],
  "India": ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur"],
  "Indonesia": ["Jakarta", "Surabaya", "Bandung", "Bekasi", "Medan", "Depok", "Tangerang", "Palembang", "Semarang", "Makassar"],
  "Italy": ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence", "Bari", "Catania"],
  "Japan": ["Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Fukuoka", "Kobe", "Kawasaki", "Kyoto", "Saitama"],
  "Malaysia": ["Kuala Lumpur", "George Town", "Ipoh", "Shah Alam", "Petaling Jaya", "Johor Bahru", "Malacca City", "Alor Setar", "Miri", "Kuching"],
  "Mexico": ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León", "Juárez", "Torreon", "Querétaro", "San Luis Potosí"],
  "Netherlands": ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Tilburg", "Groningen", "Almere", "Breda", "Nijmegen"],
  "New Zealand": ["Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga"],
  "Nigeria": ["Lagos", "Kano", "Ibadan", "Abuja", "Port Harcourt"],
  "Norway": ["Oslo", "Bergen", "Stavanger", "Trondheim", "Drammen"],
  "Philippines": ["Manila", "Quezon City", "Davao City", "Caloocan", "Cebu City", "Zamboanga City", "Antipolo", "Pasig", "Taguig", "Valenzuela"],
  "Singapore": ["Singapore", "Jurong East", "Woodlands", "Tampines", "Sengkang", "Hougang", "Yishun", "Bedok", "Punggol", "Ang Mo Kio"],
  "South Korea": ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju", "Suwon", "Ulsan", "Changwon", "Goyang"],
  "Spain": ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", "Murcia", "Palma", "Las Palmas", "Bilbao"],
  "Sweden": ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås"],
  "Switzerland": ["Zurich", "Geneva", "Basel", "Lausanne", "Bern"],
  "Thailand": ["Bangkok", "Chiang Mai", "Pattaya", "Phuket", "Hat Yai", "Nakhon Ratchasima", "Udon Thani", "Khon Kaen", "Nakhon Si Thammarat", "Chiang Rai"],
  "Turkey": ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya"],
  "United Kingdom": ["London", "Birmingham", "Manchester", "Glasgow", "Liverpool", "Leeds", "Sheffield", "Edinburgh", "Bristol", "Cardiff"],
  "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"],
  "Vietnam": ["Ho Chi Minh City", "Hanoi", "Haiphong", "Da Nang", "Can Tho"]
};

function populateCountryDropdown() {
  const countrySelect = document.getElementById('country');
  if (countrySelect) {
    // Clear existing options except the first one
    countrySelect.innerHTML = '<option value="">Select Country</option>';
    
    // Add countries to dropdown
    Object.keys(countryData).sort().forEach(country => {
      const option = document.createElement('option');
      option.value = country;
      option.textContent = country;
      countrySelect.appendChild(option);
    });
  }
}

function updateCityDropdown(selectedCountry) {
  const citySelect = document.getElementById('city');
  if (citySelect) {
    // Clear existing options
    citySelect.innerHTML = '<option value="">Select City</option>';
    
    if (selectedCountry && countryData[selectedCountry]) {
      // Add cities for selected country
      countryData[selectedCountry].forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
      });
      citySelect.disabled = false;
    } else {
      citySelect.disabled = true;
    }
  }
}

// Make functions globally available
window.populateCountryDropdown = populateCountryDropdown;
window.updateCityDropdown = updateCityDropdown;
