//package com.example.FleetSystem.repository;
//
//import com.example.FleetSystem.model.Vehicle;
//import com.example.FleetSystem.model.VehicleReplacement;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//import java.util.Optional;
//
//@Repository
//public interface VehicleReplacementRepository extends JpaRepository<VehicleReplacement,Long> {
//
//    @Query("SELECT COUNT(vr) AS total_vehicle_replacement FROM VehicleReplacement vr")
//    Long getVehicleReplacementCount();
//
//    @Query("select v from Vehicle v \n" +
//            "inner join VehicleReplacement vr\n" +
//            "on vr.id = v.vehicleReplacement\n" +
//            "where vr.vehicle = :vehicle")
//    List<Vehicle> findReplacementByVehicle(Vehicle vehicle);
//
//}
