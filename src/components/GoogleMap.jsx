import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function GoogleMapComponent({ location }) {
  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={13}
      style={{ height: "450px", width: "100%", borderRadius: "15px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[location.lat, location.lng]}>
        <Popup>Jua Kali Connect</Popup>
      </Marker>
    </MapContainer>
  );
}

export default GoogleMapComponent;