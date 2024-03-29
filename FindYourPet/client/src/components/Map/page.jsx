"use client"
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Avatar} from '@mui/material';
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

const Map = () => {
    const mapContainer = useRef(null);
    const map = useRef(null); // useRef previene que el mapa se recargue cada vez que el usuario interactue
    const [lng, setLng] = useState(-55.86);
    const [lat, setLat] = useState(-27.34);
    const [zoom, setZoom] = useState(13);
    const [posts, setPosts] = useState();

    const getLocation = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/post/all`);
            const result = await response.data;
            console.log(result);
            setPosts(result)
        } catch (error) {
            console.log({ error: error })
        }
    }

    useEffect(() => {
        // Inicia el mapa solo una vez
        if (map.current) return;

        // Asigna los valores al mapa
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom,
            attributionControl: false
        });

        // Guarda la nueva latitud, longitud y zoom cuando el usuario interactua con el mapa
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
        map.current.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true
            })
        );
        navigator.geolocation.getCurrentPosition((position) => {
            // Crea un nuevo elemento DOM
            const el = document.createElement('div');
            // Renderiza el botón de Material-UI dentro del elemento DOM
            const root = createRoot(el);
            root.render(<Avatar sx={{ backgroundColor: '#F05D41' }} />);
            // Usa el elemento DOM como marcador
            new mapboxgl.Marker(el)
                .setLngLat([position.coords.longitude, position.coords.latitude])
                .addTo(map.current);
        });

        // La funcion 'load' espera a que el mapa esté cargado antes de llamar a getLocation
        map.current.on('load', getLocation);

    }, [lng, lat]);


    useEffect(() => {
        if (posts && map.current) {
            // Muestra el marcador en la ubicación proporcionada
            posts.map((item) => {
                // Crear un nuevo elemento DOM
                const el = document.createElement('div');
                el.style.backgroundImage = `url("${item.image[0]}")`;
                el.style.backgroundSize = 'cover';
                el.style.width = '35px';
                el.style.height = '35px';
                el.style.borderRadius = '50%';
                new mapboxgl.Marker(el)
                    .setLngLat([item.location[0].lng, item.location[0].lat])
                    .addTo(map.current);//agrega los marcadores al mapa actual
            });
        }
    }, [posts]);

    return (
        <div>
            <div ref={mapContainer} style={{ height: "100vh" }} />
        </div>
    )
};

export default Map;