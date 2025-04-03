export type Localitzacio = {
    id: string,
    network_brand_name: string,
    network_name: string,
    contact: Contacte,
    coordinates: Geo,
    address: Adreca,
    opening_hours: Horari[],
    access_restriction: string,
    host: Host,
    stations: Endoll[],
    onstreet_location: boolean,
    language_code: string,
    last_updated: string
}

type Contacte = {
    operator_phone: string,
    operator_website: string
}

type Geo = {
    latitude: number,
    longitude: number
}

type Adreca = {
    address_string: string,
    locality: string,
    admin_area?: string,
    postal_code: string,
    country_code: string,
    language_code: string
}

type Horari = {
    weekday_begin: number,
    weekday_end: number,
    hour_begin: string,
    hour_end: string
}

type Host = {
    name: string,
    address: Adreca,
    contact: Contacte
}

type Endoll = {
    id: string,
    label?: string,
    coordinates: Geo,
    ports: Port[],
    notes: string
}

type Port = {
    id: string,
    connector_type: string,
    power_kw: number,
    charging_mechanism: string,
    port_status: {status: string}[],
    last_updated: string,
    authentications: Auth[],
    notes: string,
    reservable: boolean
}

type Auth = {
    authentication_id: string,
    payment_required: boolean
}