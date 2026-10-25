import { useEffect, useState } from "react";
import dataService from "../../services/dataService";
import CreateShiftModal from "./components/CreateShiftModal";
import RealTripsTable from "./components/RealTripsTable";
import ShiftsTable from "./components/ShiftsTable";
import TripsHeader from "./components/TripsHeader";

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState("SHIFTS");
  const [shifts, setShifts] = useState([]);
  const [trips, setTrips] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadData = async () => {
    const [shiftList, tripList] = await Promise.all([
      dataService.getShifts(),
      dataService.getTrips(),
    ]);
    setShifts([...shiftList]);
    setTrips([...tripList]);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddShift = async (newShift) => {
    await dataService.createShift(newShift);
    await loadData();
  };

  return (
    <div className="animate-fade-in-up space-y-6 font-sans">
      <TripsHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        shiftCount={shifts.length}
        tripCount={trips.length}
        onOpenCreateModal={() => setShowCreateModal(true)}
      />

      {activeTab === "SHIFTS" ? (
        <ShiftsTable
          shifts={shifts}
          onSwitchToTripTab={() => setActiveTab("TRIPS")}
        />
      ) : (
        <RealTripsTable trips={trips} />
      )}

      <CreateShiftModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onAddShift={handleAddShift}
      />
    </div>
  );
}
