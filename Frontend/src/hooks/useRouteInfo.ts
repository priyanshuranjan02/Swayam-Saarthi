import { useEffect, useState } from "react";

export default function useRouteInfo(

driver:any,

destination:any

){

const [distance,setDistance]=useState(0);

const [duration,setDuration]=useState(0);

useEffect(()=>{

async function fetchRoute(){

const res=await fetch(

`https://router.project-osrm.org/route/v1/driving/${driver.lng},${driver.lat};${destination.lng},${destination.lat}?overview=false`

);

const data=await res.json();

if(data.routes?.length){

setDistance(

data.routes[0].distance

);

setDuration(

data.routes[0].duration

);

}

}

fetchRoute();

},[driver,destination]);

return{

distance,

duration

};

}