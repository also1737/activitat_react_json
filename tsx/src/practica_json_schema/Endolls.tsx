import { MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'

import { endolls } from "./generar.ts";
import { Localitzacio } from "./objetos.ts";
import './index.css';
import { SetStateAction, useState } from "react";
import { LatLngExpression } from 'leaflet';

export default function Endolls() {

    const [ports, setPorts] = useState({
        id: "",
        mostrar: false
    });
    const [mapa, setMapa] = useState({
        id: "",
        mostrar: false
    });

    const notes_port = new Map();
    notes_port.set("MOTORCYCLE_ONLY", "Nomès per a motos")

    function ordenarPerCodiPostal() {
        endolls.sort((a, b) => Number.parseInt(a.address.postal_code) - Number.parseInt(b.address.postal_code))
    }
    function alternarRender(a: { id?: string; mostrar: any; }, setA: { (value: SetStateAction<{ id: string; mostrar: boolean; }>): void; (arg0: { id: any; mostrar: boolean; }): void; }, endoll: Localitzacio) {
        if (a.mostrar) { 
            setA({id: endoll.id, mostrar: false}) 
        } else {
            setA({id: endoll.id, mostrar: true})
        }
    }
    function mostrarPorts(endoll: Localitzacio) {

        const stations = endoll.stations;
        console.log(endoll.id);
        return (
            <div>
                {stations.map( s => 
                    <div /*className="caixa"*/ key={s.id}>
                        <p>Label: {s.label}</p>
                        <p>Ports:</p>
                        <ul>{s.ports.map( port =>
                            <li key={port.id}>
                                <span>Potència: {port.power_kw} KW</span>
                                <span>{notes_port.get(port.notes)}</span>
                            </li>
                        )}
                        </ul>
                    </div>
                
                )}
            </div>
        )
    }
    function mostrarMapa(endoll: Localitzacio) {

        const position: LatLngExpression = [
            endoll.coordinates.latitude,
            endoll.coordinates.longitude
        ];

        return (
            <MapContainer center={position} zoom={16} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                <Popup>
                    Localització de punt de recàrrega
                </Popup>
                </Marker>
            </MapContainer>
        )
    }
    function mostrarEndolls(endolls: Localitzacio[]) {
        return(
            endolls.map(endoll => 
                <div className="caixa" key={endoll.id}>
                    <p className="azul grande">{endoll.address.address_string}, <b>{endoll.address.postal_code}</b></p>
                    <p >Proveidor: {endoll.network_name}</p>

                    {endoll.onstreet_location == false ?
                        <p>{endoll.stations[0].notes}</p> :
                        <p>Sobre carrer</p>
                    }
                    <button onClick={() => alternarRender(ports, setPorts, endoll)}>Ports</button>
                    <button onClick={() => alternarRender(mapa, setMapa, endoll)}>Mapa</button>
                    {ports.mostrar == true && ports.id == endoll.id &&
                        <div>
                            <p className='azul grande'>Ports:</p>
                            {mostrarPorts(endoll)}
                        </div>
                    }
                    {mapa.mostrar == true && mapa.id == endoll.id &&
                        <div>                      
                            <p className='azul grande'>Mapa:</p>
                            <div id="map">{mostrarMapa(endoll)}</div>
                        </div>
                    }
                </div>
        )
        );
    }

    return (
        <>
            <h1 className="azul">Punts de recàrrega elèctrica de Barcelona</h1>
            
            <div>
                <p>Ordenar per:</p>
                <button onClick={() => ordenarPerCodiPostal()}>Codi Postal</button>
            </div>

            {mostrarEndolls(endolls)}
            
        </>
        
    );  
}