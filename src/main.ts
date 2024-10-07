import {errorModal, restaurantModal, restaurantRow} from './components';
import {fetchData} from './functions';
import {apiUrl, positionOptions} from './variables';
import {Restaurant} from './types/Restaurant';
import { Course, DailyMenu, WeeklyMenu } from './types/Menu';
import { calculateDistance } from './distance';
import { newMarkers, setMap } from './map';



const modal = document.querySelector('dialog');
if (!modal) {
  throw new Error('Modal not found');
}
modal.addEventListener('click', () => {
  modal.close();
});


const map = setMap()

const createTable = (restaurants: Restaurant[]) => {
  newMarkers(restaurants, map)
  const table = document.querySelector('table');
  if (!table){
    console.error('talbe is missing in html');
    return;
  }

  table.innerHTML = '';
  restaurants.forEach((restaurant) => {
    const tr = restaurantRow(restaurant);
    table.appendChild(tr);
    tr.addEventListener('click', async () => {
      try {
        // remove all highlights
        const allHighs = document.querySelectorAll('.highlight');
        allHighs.forEach((high) => {
          high.classList.remove('highlight');
        });
        // add highlight
        tr.classList.add('highlight');
        // add restaurant data to modal
        modal.innerHTML = '';

        // fetch menu
        const menu = await fetchData<DailyMenu>(
          apiUrl + `/restaurants/daily/${restaurant._id}/fi`
        );
        console.log(menu);

        const menuHtml = restaurantModal(restaurant, menu);
        modal.insertAdjacentHTML('beforeend', menuHtml);

        modal.showModal();
      } catch (error) {
        modal.innerHTML = errorModal((error as Error).message);
        modal.showModal();
      }


    });
  });
};

const error = (err: GeolocationPositionError) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

const success = async (pos: GeolocationPosition) => {
  try {
    const crd = pos.coords;
    const restaurants = await fetchData<Restaurant[]>(apiUrl + '/restaurants');
    console.log(restaurants);

// Sort by distanse ----
    restaurants.sort((a: Restaurant, b: Restaurant) => {
      const locLati = crd.latitude;
      const locLongi = crd.longitude;
      const latiA = a.location.coordinates[1];
      const longiA = a.location.coordinates[0];
      const distanceA = calculateDistance(locLati, locLongi, latiA, longiA);
      const latiB = b.location.coordinates[1];
      const longiB = b.location.coordinates[0];
      const distanceB = calculateDistance(locLati, locLongi, latiB, longiB);
      return distanceA - distanceB;
    });

    createTable(restaurants);

    // buttons for filtering ----
    const sodexoBtn = document.querySelector('#sodexo');
    const compassBtn = document.querySelector('#compass');
    const resetBtn = document.querySelector('#reset');

    // button filter code ----
    if (!sodexoBtn){
      console.error('SodexoBtn missing in html')
      return;
    }
    sodexoBtn.addEventListener('click', () => {
      const sodexoRestaurants = restaurants.filter(
        (restaurant) => restaurant.company === 'Sodexo'
      );
      console.log(sodexoRestaurants);
      createTable(sodexoRestaurants);
    });

    if (!compassBtn){
      console.error('CompassBtn missing in html')
      return;
    }
    compassBtn.addEventListener('click', () => {
      const compassRestaurants = restaurants.filter(
        (restaurant) => restaurant.company === 'Compass Group'
      );
      console.log(compassRestaurants);
      createTable(compassRestaurants);
    });

    if (!resetBtn){
      console.error('ResetBtn missing in html')
      return;
    }
    resetBtn.addEventListener('click', () => {
      createTable(restaurants);
    });

  } catch (error) {
    modal.innerHTML = errorModal((error as Error).message);
    modal.showModal();
  }
};





navigator.geolocation.getCurrentPosition(success, error, positionOptions);
