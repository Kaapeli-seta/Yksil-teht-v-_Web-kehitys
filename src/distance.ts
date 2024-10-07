const calculateDistance = (locLati: number, locLongi: number, lati: number, longi: number) =>
    Math.sqrt((lati - locLati) ** 2 + (longi - locLongi) ** 2);

export {calculateDistance}