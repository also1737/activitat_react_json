import { MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'

import { endolls } from "./generar.ts";
import { Localitzacio } from "./objetos.ts";
import './index.css';
import { ReactNode, SetStateAction, useState } from "react";
import { LatLngExpression } from 'leaflet';

function alternarRender(a: { id?: string; mostrar: any; }, setA: { (value: SetStateAction<{ id: string; mostrar: boolean; }>): void; (arg0: { id: any; mostrar: boolean; }): void; }, endoll: Localitzacio) {
    if (a.mostrar) { 
        setA({id: endoll.id, mostrar: false}) 
    } else {
        setA({id: endoll.id, mostrar: true})
    }
}

interface PropsBarraCerca {
    ordenar: any
    setOrdenar: any
    cerca: any
    setCerca: any
    tipusPunt: any
    setTipusPunt: any
}
function BarraCerca({ordenar, setOrdenar, cerca, setCerca, tipusPunt, setTipusPunt}: PropsBarraCerca) {

    return (
        <form className="caixa">
            <input 
                type="search"
                value={cerca}
                placeholder="Cerca adreces..."
                onChange={(e) => setCerca(e.target.value)}
            />
            <br />
            <p>Filtres:</p>
            <label>
                Ordenar per Codi Postal: 
                <input
                    type="checkbox"
                    checked={ordenar}
                    onChange={(e) => setOrdenar(e.target.checked)}
                />
            </label>
            <label>
                Tipus de punt:
                Sobre carrer
                <input 
                    type="radio"
                    name="tipus"
                    value="carrer"
                    checked={tipusPunt === 'carrer'}
                    onChange={(e) => setTipusPunt(e.target.value)}
                />
                Parking
                <input 
                    type="radio"
                    name="tipus"
                    value="parking"
                    checked={tipusPunt === 'parking'}
                    onChange={(e) => setTipusPunt(e.target.value)}
                />
                Tots
                <input 
                    type="radio"
                    name="tipus"
                    value="dos"
                    checked={tipusPunt === 'dos'}
                    defaultChecked
                    onChange={(e) => setTipusPunt(e.target.value)}
                />
            </label>
        </form>
    )
}

interface PropsPort {
    ports: { id?: string; mostrar: any; },
    endoll: Localitzacio
}
function Port({endoll, ports}: PropsPort) {

    if (ports.mostrar == true && ports.id == endoll.id) {
        const stations = endoll.stations;
        return (
            <div>
                <p className='azul grande'>Ports:</p>
                    <div>
                    {stations.map( s => 
                        <div /*className="caixa"*/ key={s.id}>
                            <p>Label: {s.label}</p>
                            <p>Ports:</p>
                            <ul>{s.ports.map( port =>
                                <li key={port.id}>
                                    <span>Potència: {port.power_kw} KW</span>
                                    <span>{port.notes}</span>
                                </li>
                            )}
                            </ul>
                        </div>
            
                    )}
                    </div>
            </div>
        )
    }
}

interface PropsMapa {
    mapa: { id?: string; mostrar: any; },
    endoll: Localitzacio
}
function Mapa({endoll, mapa}: PropsMapa) {

    const position: LatLngExpression = [
        endoll.coordinates.latitude,
        endoll.coordinates.longitude
    ];

    if (mapa.mostrar == true && mapa.id == endoll.id) {
        return (
            <>
                <p className='azul grande'>Mapa:</p>
                <div id="map">
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
                </div>
            </>
        )
    }
}

interface PropsBoton {
    estado: { id: string; mostrar: boolean; },
    setEstado: React.Dispatch<SetStateAction<{ id: string; mostrar: boolean; }>>,
    endoll: Localitzacio,
    texto: string
}
function BotonRender({estado, setEstado, endoll, texto}: PropsBoton) {
    return (
        <button onClick={() => alternarRender(estado, setEstado, endoll)}>{texto}</button>
    );
}

interface PropsTaulaPunts {
    endolls: Localitzacio[],
    ordenar: boolean,
    cerca: string,
    tipusPunt: string
}
function TaulaPuntsRecarrega({endolls, ordenar, cerca, tipusPunt}: PropsTaulaPunts) {
    
    const caixes: ReactNode[] = [];
    const endollsCopia: Localitzacio[] = [...endolls];
    
    if (ordenar) {
        endollsCopia.sort((a, b) => Number.parseInt(a.address.postal_code) - Number.parseInt(b.address.postal_code))
    }


    endollsCopia.forEach( (endoll) => {
        
        if (endoll.address.address_string.toLowerCase().indexOf(cerca.toLowerCase()) === -1) return;
        
        if (endoll.onstreet_location && tipusPunt === 'parking') return;
        if (!endoll.onstreet_location && tipusPunt === 'carrer') return;
        
        caixes.push(
            <PuntRecarrega 
                {...endoll}
            />
        )
        
    });

    return(
        <div>{caixes}</div>
    );
}
function PuntRecarrega(endoll: Localitzacio) {
    const [ports, setPorts] = useState({
        id: "",
        mostrar: false
    });
    const [mapa, setMapa] = useState({
        id: "",
        mostrar: false
    });

    return(
        <div className="caixa" key={endoll.id}>
            <InfoPunt {...endoll}/>
            <BotonRender estado={ports} setEstado={setPorts} endoll={endoll} texto={"Ports"}/>
            <BotonRender estado={mapa} setEstado={setMapa} endoll={endoll} texto={"Mapa"}/>
                
            <Port 
                endoll={endoll}
                ports={ports} />
            <Mapa 
                endoll={endoll}
                mapa={mapa}
            />
        </div>
    
    );
}
function InfoPunt(endoll: Localitzacio) {
    return (
        <>
            <p className="azul grande">{endoll.address.address_string}, <b>{endoll.address.postal_code}</b></p>
            <p >Proveidor: {endoll.network_name}</p>

            {endoll.onstreet_location == false ?
                <p>{endoll.stations[0].notes}</p> :
                <p>Sobre carrer</p>
            }
        </>
    );
}

export default function Endolls() {

    const [ordenar, setOrdenar] = useState(false);
    const [cerca, setCerca] = useState('');
    const [tipusPunt, setTipusPunt] = useState('');

    return (
        <>
            <h1 className="azul">Punts de recàrrega elèctrica de Barcelona</h1>
            <BarraCerca 
                ordenar={ordenar}
                setOrdenar={setOrdenar}
                cerca={cerca}
                setCerca={setCerca}
                tipusPunt={tipusPunt}
                setTipusPunt={setTipusPunt}
            />
            <TaulaPuntsRecarrega 
                endolls={endolls}
                ordenar={ordenar}
                cerca={cerca}
                tipusPunt={tipusPunt}
            />
        </>
        
    );  
}