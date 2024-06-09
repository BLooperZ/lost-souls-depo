import React, { createContext, useReducer, useContext, useState, useEffect, useCallback, useRef } from 'react';
import PWABadge from './PWABadge.tsx'
import { useLocation, useNavigate } from 'react-router-dom';
import Parallax from 'parallax-js';
import './App.css'
import backgroundImage from './assets/background.png';

import VideoClassifier from './VideoClassifier.jsx';

// Initial data for ghosts and artifacts
const ghostsData = {
    garden: [
        { id: 'shalom', name: 'Shlomi', artifactId: 'bottle', isAwake: false, isFulfilled: false },
        { id: 'kobi', name: 'Kobi', artifactId: 'cube', isAwake: false, isFulfilled: false },
        { id: 'rami', name: 'Rami', artifactId: 'toothpaste', isAwake: false, isFulfilled: false },
    ],
    playroom: [
        { id: 'oded', name: 'Oded', artifactId: 'carrot', isAwake: false, isFulfilled: false },
        { id: 'hanan', name: 'Hanan', artifactId: 'viewmaster', isAwake: false, isFulfilled: false },
        { id: 'shayke', name: 'Shayke', artifactId: 'penguin', isAwake: false, isFulfilled: false },
    ],
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
    }, [state]);

    const handleGoBackToMap = () => {
        setCurrentEra(null);
        navigate('/');
    };

    const handleReset = () => {
        dispatch({ type: 'RESET' });
    };

    return (
        <>
            <GhostContext.Provider value={{ state, dispatch }}>
                <div style={{
                    height: '100vh',
                    width: '100vw',
                }}>
                    <button onClick={handleGoBackToMap}>Go Back to Map</button>
                    <button onClick={handleReset}>Reset</button>
                    {currentEra === null ? (
                        <EraMap setCurrentEra={setCurrentEra} />
                    ) : (
                        <EraGallery era={currentEra} />
                    )}
                </div>
            </GhostContext.Provider>
            <PWABadge />
        </>
    );
};

// EraMap component
const EraMap = ({ setCurrentEra }) => {
    return (
        <div>
            <h1>Select an Era</h1>
            {Object.keys(ghostsData).map(era => (
                <button key={era} onClick={() => setCurrentEra(era)}>{era}</button>
            ))}
        </div>
    );
};

// Gallery component
const Gallery = ({ era, ghostsData, handleSelectGhost }) => {
    const sceneRef = useRef();

    useEffect(() => {
        const scene = sceneRef.current;
        new Parallax(scene, {
            relativeInput: true,
        });
    }
        , []);

    const positions = [
        { depth: 1.00, top: '3%', left: '1%', width: 100, height: 200 },
        { depth: 0.80, top: 0, left: '5%', width: 100, height: 100 },
        { depth: 0.60, top: '14%', left: 0, width: 150, height: 150 },
    ]

    return (
        <div>
            <h1 >{era} Gallery</h1>
            <div style={{
                height: '100vh',
                width: '100vw',
            }}>
                <div ref={sceneRef} className="scene" style={{
                    margin: 0,
                    padding: 0,
                    height: '100vh',
                    width: '100vw',
                    backgroundColor: 'black',
                    overflow: 'hidden',
                    position: 'absolute',
                }}>
                    <div data-depth="0.40" style={{
                        margin: '-10% -40%',
                        padding: 0,
                        height: '150%',
                        width: '150%',
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        overflow: 'hidden',
                    }}></div>
                </div>
                <div style={{
                    margin: 0,
                    padding: 0,
                    // top: '50%',
                    height: '100vh',
                    width: '100vw',
                    backgroundColor: 'transparent',
                    // position: 'absolute',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around', // Add this line
                }}>
                    {ghostsData[era].map((ghost, idx) => {
                        const { depth, ...pos } = positions[idx];
                        return (
                            <button
                                key={ghost.id}
                                className="floating"
                                onClick={() => handleSelectGhost(ghost.id)}
                                disabled={!ghost.isAwake}
                                style={{ position: 'relative', ...pos, opacity: ghost.isFulfilled ? 0.5: 1}}
                            >
                                {ghost.name} {ghost.isFulfilled ? '😊' : ghost.isAwake ? '😐' : '😴'}
                            </button>
                        )
                    })}
                </div>
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
        <div>
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
