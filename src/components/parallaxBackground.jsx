import Parallax from 'parallax-js';
import { useEffect, useRef } from 'react';

import backgroundImage from '../assets/background.jpg';
import fog from '../assets/smoke united.png';

import '../App.css';

const ParallaxBackground = () => {

    const sceneRef = useRef();

    useEffect(() => {
        const scene = sceneRef.current;
        new Parallax(scene, {
            relativeInput: true,
            invertX: false,
            invertY: false,
        });
    }
        , []);

    return (
        <div ref={sceneRef} className="scene" style={{
            margin: 0,
            padding: 0,
            height: '100svh',
            width: '100vw',
            backgroundColor: 'black',
            overflow: 'hidden',
            position: 'absolute',
        }}>
            <div data-depth="0.60" style={{
                margin: '-15% -15%',
                padding: 0,
                height: '150%',
                width: '130%',
                // background: 'radial-gradient(red, transparent)',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'contain',
                overflow: 'hidden',
            }} />
            <div data-depth="0.80" className="fading"  style={{
                margin: '120% -170%',
                padding: 0,
                height: '60%',
                width: '240%',
                backgroundImage: `url(${fog})`,
                backgroundSize: 'cover',
                backgroundPosition: 'left',
                overflow: 'hidden',
            }} />
            <div data-depth="0.90" className="fading" style={{
                margin: '140% -40%',
                padding: 0,
                height: '60%',
                width: '300%',
                backgroundImage: `url(${fog})`,
                backgroundSize: 'cover',
                backgroundPosition: 'right',
                overflow: 'hidden',
            }} />
            {/* <div data-depth="1.00" style={{
                margin: '100% -15%',
                padding: 0,
                borderRadius: '10%',
                height: '120%',
                width: '120%',
                background: 'linear-gradient(transparent, transparent, white, white, white, white, white, white)',
                backgroundSize: 'cover',
                overflow: 'hidden',
            }} /> */}
        </div>
    )
}

export default ParallaxBackground;