import * as React from 'react';
import Typography from '../components/Typography';
import ProductHeroLayout from './ProductHeroLayout';
import {useEffect, useState} from "react";
import {toast} from "react-toastify";

const backgroundImage =
    'https://images.unsplash.com/photo-1551524164-7d2f9ff12c70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80';
const API_KEY = '658d847ef1d28e72e047ab0c5a476d54' as const;

function CurrentWeather() {
    const [weather, setWeather] = useState<any>(null);

    // 현재 위치 가져오기
    const getCurrentLocation = () => {
        if (navigator.geolocation) {        // GPS를 지원하면
            navigator.geolocation.getCurrentPosition((position) => {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;
                getWeatherByCurrentLocation(lat, lon);
            });
        } else {
            toast.error("GPS를 지원하지 않아 사용자의 위치를 불러올 수 없습니다 😭", {
                position: "top-center",
                autoClose: 1500,
            });
            getWeatherByCurrentLocation(37.5666805, 126.9784147);       // 서울의 위도, 경도를 넘겨줌
        }
    }

    // 현재 위치 날씨 API 가져오기
    const getWeatherByCurrentLocation = async (lat:number, lon:number) => {
        // &units=metric => 섭씨 사용
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=kr&units=metric`;
        // url에 데이터를 가져올 때까지 기다려 주세요
        let response = await fetch(url);
        let data = await response.json();
        // weather에 데이터 담기
        setWeather(data);
        // localStorage에 날씨 데이터 저장하기
        localStorage.setItem("currentWeather", data.main.temp);
    };
    useEffect(() => {
        getCurrentLocation();
    }, []);

    return (
        <ProductHeroLayout
            sxBackground={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundColor: '#7fc7d9', // Average color of the background image.
                backgroundPosition: 'center',
            }}
        >
            <Typography color="inherit" align="center" variant="h3" marked="center">
                { weather == null ? 'NO WEATHER DATA😢' : weather!.name }
            </Typography>
            <Typography
                color="inherit"
                align="center"
                variant="h1"
                sx={{ mt: { sx: 4, sm: 6 } }}
            >
                { weather == null ? '❔' : weather!.main.temp }°
            </Typography>
            <Typography
                color="inherit"
                align="center"
                variant="h6"
                sx={{ mb: 2, mt: { sx: 4, sm: 2 } }}
            >
                🌡 체감 온도 { weather == null ? '❔' : weather!.main.feels_like }°
            </Typography>
            <Typography
                color="inherit"
                align="center"
                variant="h5"
                sx={{ mb: 4, mt: { sx: 4, sm: 2 } }}
            >
                🌂 비가 올 확률은 { weather == null ? '❔' : weather!.clouds.all }% 입니다.
            </Typography>

        </ProductHeroLayout>
    );
}
export default CurrentWeather;