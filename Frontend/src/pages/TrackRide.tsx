import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import LiveMap from "@/components/maps/LiveMap";

export default function TrackRide() {

  const [driverLocation] = useState({
    lat: 28.6139,
    lng: 77.2090,
  });

  return (

    <PageLayout>

      <div className="page-container">

        <h1 className="text-3xl font-bold mb-6">
          Live Ride Tracking
        </h1>

        <div className="glass-card p-6">

          <div className="mb-6">

            <h2 className="font-semibold text-xl">
              Driver Information
            </h2>

            <p>Driver: Rahul Kumar</p>

            <p>Vehicle: White Swift Dzire</p>

            <p>Status: Ongoing Ride</p>

          </div>

          <LiveMap
            driverLocation={driverLocation}
          />

        </div>

      </div>

    </PageLayout>

  );

}


// import { useState } from "react";
// import PageLayout from "@/components/layout/PageLayout";
// import LiveMap from "@/components/maps/LiveMap";

// export default function TrackRide() {
//   const [driverLocation] = useState({
//     lat: 28.6139,
//     lng: 77.2090,
//   });

//   return (
//     <PageLayout>
//       <div className="p-6">
//         <LiveMap driverLocation={driverLocation} />
//       </div>
//     </PageLayout>
//   );
// }