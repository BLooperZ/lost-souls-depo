import React, { createContext, useReducer, useContext, useState, useEffect, useCallback, useRef } from 'react';
import PWABadge from './PWABadge.tsx'
import { useLocation, useNavigate } from 'react-router-dom';
import Parallax from 'parallax-js';
import './App.css'
import backgroundImage from './assets/background.png';

import greenButton from './assets/green_button.jpg';
import redButton from './assets/red_button.jpg';
import caveman from './assets/caveman.webm';
import cavemanMov from './assets/CaveMan.mov';
import cavemaam from './assets/cavemaam.webm';
import cavemaamMov from './assets/CaveWomen.mov';
import shaman from './assets/shaman.webm';
import shamanMov from './assets/Shamanit.mov';

import MapSvg from './MapSvg.jsx';

import VideoClassifier from './VideoClassifier.jsx';

const ghostSourceKeys = {
    cavemaam: {vp9: cavemaam, hevc: cavemaamMov},
    caveman: {vp9: caveman, hevc: cavemanMov},
    shaman: {vp9: shaman, hevc: shamanMov},
}

// Initial data for ghosts and artifacts
const ghostsData = {
    metadata: {
        version: 1,
    },
    garden: [
        { id: 'shalom', name: 'Shlomi', artifactId: 'bottle', source: 'caveman', isAwake: false, isFulfilled: false },
        { id: 'kobi', name: 'Kobi', artifactId: 'cube', source: 'shaman', isAwake: false, isFulfilled: false },
        { id: 'rami', name: 'Rami', artifactId: 'toothpaste', source: 'cavemaam', isAwake: false, isFulfilled: false },
    ],
    playroom: [
        { id: 'oded', name: 'Oded', artifactId: 'carrot', source: 'shaman', isAwake: false, isFulfilled: false },
        { id: 'hanan', name: 'Hanan', artifactId: 'viewmaster', source: 'cavemaam', isAwake: false, isFulfilled: false },
        { id: 'shayke', name: 'Shayke', artifactId: 'penguin', source: 'caveman', isAwake: false, isFulfilled: false },
    ],
    lastEra: 'dawnandkalkolithic',
};

const artifactsData = {
    bottle: 'Bottle',
    cube: 'Cube',
    toothpaste: 'Toothpaste',
    carrot: 'Carrot',
    viewmaster: 'View-Master',
    penguin: 'Penguin',
};

// Ghost context and reducer
const GhostContext = createContext();

const ghostReducer = (state, action) => {
    switch (action.type) {
        case 'RESET':
            return ghostsData; // Reset state to initial data
        case 'AWAKEN_GHOSTS':
            return {
                ...state,
                [action.era]: state[action.era].map(ghost => ({ ...ghost, isAwake: true }))
            };
        case 'FULFILL_GHOST':
            return {
                ...state,
                [action.era]: state[action.era].map(ghost =>
                    ghost.id === action.ghostId ? { ...ghost, isFulfilled: true } : ghost
                )
            };
        case 'VISIT_ERA':
            return {
                ...state,
                lastEra: action.era
            }
        default:
            return state;
    }
};

// App component
const App = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentEra, setCurrentEra] = useState(null);
    const [state, dispatch] = useReducer(ghostReducer, JSON.parse(localStorage.getItem('ghostsData')) || ghostsData);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const era = queryParams.get('era');
        setCurrentEra(era);
    }, [location]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const era = queryParams.get('era');
        if (currentEra && era !== currentEra) {
            navigate(`?era=${currentEra}`);
        }
    }, [currentEra, navigate, location]);

    useEffect(() => {
        localStorage.setItem('ghostsData', JSON.stringify(state));
        if (state.metadata?.version != ghostsData.metadata.version) {
            handleReset();
        }
    }, [state]);

    const handleGoBackToMap = () => {
        dispatch({ type: 'VISIT_ERA', era: currentEra });
        setCurrentEra(null);
        navigate('/');
    };

    const handleReset = () => {
        dispatch({ type: 'RESET' });
    };
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
        <>
            <GhostContext.Provider value={{ state, dispatch }}>
                <div style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <div ref={sceneRef} className="scene" style={{
                        margin: 0,
                        padding: 0,
                        height: '100lvh',
                        width: '100vw',
                        backgroundColor: 'black',
                        overflow: 'hidden',
                        position: 'absolute',
                    }}>
                        <div data-depth="0.40" style={{
                            margin: '-30% -10%',
                            padding: 0,
                            height: '130%',
                            width: '120%',
                            backgroundImage: `url(${backgroundImage})`,
                            backgroundSize: 'cover',
                            overflow: 'hidden',
                        }} />
                    </div>
                    <main style={{ position: 'absolute', zIndex: 1, height: '100lvh', width: '100vw', display:'flex', flexDirection:'column' }}>
                            {currentEra === null ? (
                                <EraMap setCurrentEra={setCurrentEra} era={state.lastEra || 'dawnandkalkolithic'} />
                            ) : (
                                <EraGallery era={currentEra} />
                            )}
                        </main>
                    <div style={{ pointerEvents:"none", position: 'absolute', zIndex: 2, height: '100lvh', width: '100vw', display:'flex', flexDirection:'column'}}>
                        <nav style={{pointerEvents:"all"}}>
                            <button onClick={handleGoBackToMap}>Go Back to Map</button>
                            <button onClick={handleReset}>Reset</button>
                        </nav>
                        {/* <h1>{currentEra} Gallery</h1> */}
                        <footer style={{ marginTop: "auto" }}><p>Something below</p></footer>
                    </div>
                </div>
            </GhostContext.Provider>
            <PWABadge />
        </>
    );
};

// EraMap component
const EraMap = ({ era, setCurrentEra }) => {
    return (
        <div style={{height: '100%', margin: 'auto 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}><MapSvg setCurrentEra={setCurrentEra} era={era} /></div>
            {/* <h1>Select an Era</h1>
            {Object.keys(ghostsData).filter(era => era !== 'metadata').map(era => (
                <button key={era} onClick={() => setCurrentEra(era)}>{era}</button>
            ))} */}
        </div>
    );
};

// Gallery component
const Gallery = ({ era, ghostsData, handleSelectGhost }) => {


    const positions = [
        // { depth: 1.00, top: '-7%', left: '6%', transform: 'rotate(6deg)', width: 300, animationDelay: '1s' },
        // { depth: 0.80, top: '-16%', left: '5%', transform: 'rotate(-12deg)', width: 300, animationDelay: 0 },
        // { depth: 0.60, top: '7%', left: '-10%', transform: 'rotate(3deg)', width: 300, animationDelay: '0.5s' },
        { depth: 1.00, top: '-3%', left: '6%', transform: 'rotate(6deg)', width: 300, animationDelay: '1s' },
        { depth: 0.80, top: '-18%', left: '5%', transform: 'rotate(-12deg)', width: 300, animationDelay: 0 },
        { depth: 0.60, top: '11%', left: '-10%', transform: 'rotate(3deg)', width: 300, animationDelay: '0.5s' },
    ]

    return (
        <div onContextMenu={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

            <div style={{
                margin: 'auto 0',
                padding: 0,
                // top: '50%',
                height: '100%',
                width: '100%',
                backgroundColor: 'transparent',
                // position: 'absolute',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
            }}>
                {ghostsData[era].map((ghost, idx) => {
                    const { depth, transform, animationDelay, ...pos } = positions[idx];
                    return (
                        <button
                            key={ghost.id}
                            className="floating button-test"
                            onClick={() => handleSelectGhost(ghost.id)}
                            disabled={!ghost.isAwake}
                            style={{ position: 'relative', ...pos, aspectRatio: 1 }}
                        >
                            <video autoPlay loop muted playsInline className="fading" style={{ marginLeft: '-30%', width: '180%', height: '180%', objectFit: 'contain', transform, animationDelay, /* opacity: ghost.isFulfilled ? 0.2 : 0.6 */ }}>
                                <source src={ghostSourceKeys[ghost.source]['hevc']} type='video/mp4; codecs="hvc1"' />
                                <source src={ghostSourceKeys[ghost.source]['vp9']} type="video/webm" />
                            </video>
                            {/* {ghost.name} {ghost.isFulfilled ? '😊' : ghost.isAwake ? '😐' : '😴'} */}
                        </button>
                    )
                })}
            </div>
        </div>
    )
};

// Memory component
const Memory = ({ ghost, artifactId, handleSearch, handleReturn }) => {
    return (
        <div>
            <h1>Memory of {ghost.name}</h1>
            <p>{ghost.name} recalls the {artifactsData[artifactId]}.</p>
            {ghost.isFulfilled ? (
                <p>Artifact fulfilled!</p>
            ) : (
                <button onClick={handleSearch}>Search for Artifact</button>
            )}
            <button onClick={handleReturn}>Return to Gallery</button>
        </div>
    )
};

// Search component
const Search = ({ ghost, artifactId, handleFound, handleReturn }) => {
    return (
        <div style={{ display: 'flex', height: '100%', width: '100%', flex: 1, flexDirection: 'column' }}>
            <h1>Searching for {artifactsData[artifactId]}</h1>
            {ghost.isFulfilled ? (
                <p>Artifact already found!</p>
            ) : (
                <VideoClassifier artifactId={artifactId} handleFound={handleFound} />
            )}
            <button onClick={handleReturn}>Return to Memory</button>
        </div>
    )
};

// EraGallery component
const EraGallery = ({ era }) => {
    const { state: ghostsData, dispatch } = useContext(GhostContext);
    const [selectedGhost, setSelectedGhost] = useState(null);
    const [currentStage, setCurrentStage] = useState('gallery'); // Default stage
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const awaken = queryParams.get('awaken');
        const eraGhosts = ghostsData[era];
        const areGhostsAwake = eraGhosts.every(ghost => ghost.isAwake);
        if (awaken === 'true' && !areGhostsAwake) {
            dispatch({ type: 'AWAKEN_GHOSTS', era });
            navigate(`?era=${era}`); // Update URL
        }
    }, [era, location, dispatch, ghostsData, navigate]);

    const handleSelectGhost = useCallback((ghostId) => {
        setSelectedGhost(ghostId);
        setCurrentStage('memory');
    }, []);

    const handleFoundArtifact = useCallback((ghostId) => {
        dispatch({ type: 'FULFILL_GHOST', era, ghostId });
        setSelectedGhost(null);
        setCurrentStage('gallery');
    }, [era]);

    console.log('Rendering EraGallery', { era, ghostsData, selectedGhost, currentStage })

    const handleFound = useCallback(() => handleFoundArtifact(selectedGhost), [selectedGhost]);

    const goToMemory = useCallback(() => setCurrentStage('memory'), []);
    const goToSearch = useCallback(() => setCurrentStage('search'), []);
    const goToGallery = useCallback(() => setCurrentStage('gallery'), []);

    const renderStage = () => {
        const ghost = ghostsData[era].find(ghost => ghost.id === selectedGhost);
        if (currentStage === 'gallery') {
            return <Gallery era={era} ghostsData={ghostsData} handleSelectGhost={handleSelectGhost} />;
        } else if (currentStage === 'memory') {
            return <Memory ghost={ghost} artifactId={ghost.artifactId} handleSearch={goToSearch} handleReturn={goToGallery} />;
        } else if (currentStage === 'search') {
            return <Search ghost={ghost} artifactId={ghost.artifactId} handleFound={handleFound} handleReturn={goToMemory} />;
        }
        // Add more stages as needed
    };

    return renderStage();
};


export default App;
