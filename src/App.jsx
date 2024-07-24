import React, { createContext, useReducer, useContext, useState, useEffect, useCallback, useRef } from 'react';
import PWABadge from './PWABadge.tsx'
import { useLocation, useNavigate } from 'react-router-dom';
import './App.css'


import greenButton from './assets/green_button.jpg';
import redButton from './assets/red_button.jpg';
import caveman from './assets/caveman.webm';
import cavemanMov from './assets/CaveMan.mov';
import cavemaam from './assets/cavemaam.webm';
import cavemaamMov from './assets/CaveWomen.mov';
import shaman from './assets/shaman.webm';
import shamanMov from './assets/Shamanit.mov';
import cavemanVideo from './assets/full_w_ghost.mp4';

import titleSvg from './assets/title.svg';
import scanSvg from './assets/scan.svg';

import Compass from './assets/compass.svg?react';
import Panel from './assets/panel.svg';
import Eye from './assets/eye.svg?react';

import RoundButton from './components/button.jsx';
import VideoClassifier from './VideoClassifier.jsx';
import ParallaxBackground from './components/parallaxBackground.jsx';

import Fire from './assets/campfire.svg?react';
import Rock from './assets/stone.svg?react';
import Tusk from './assets/tusk.svg?react';

import TextPanel from './assets/text panel.svg';
import ObjectPanel from './assets/object panel.svg';

import MapNew from './MapNew.jsx';

const ghostSourceKeys = {
    cavemaam: { vp9: cavemaam, hevc: cavemaamMov },
    caveman: { vp9: caveman, hevc: cavemanMov },
    shaman: { vp9: shaman, hevc: shamanMov },
}

// Initial data for ghosts and artifacts
const ghostsData = {
    metadata: {
        version: 1,
    },
    garden: [
        { id: 'shalom', name: 'Shlomi', artifactId: 'bottle', source: 'caveman', isAwake: false, isFulfilled: false, },
        { id: 'kobi', name: 'Kobi', artifactId: 'cube', source: 'shaman', isAwake: false, isFulfilled: false },
        { id: 'rami', name: 'Rami', artifactId: 'toothpaste', source: 'cavemaam', isAwake: false, isFulfilled: false },
    ],
    playroom: [
        { id: 'oded', name: 'Oded', artifactId: 'carrot', source: 'shaman', isAwake: false, isFulfilled: false },
        { id: 'hanan', name: 'Hanan', artifactId: 'viewmaster', source: 'cavemaam', isAwake: false, isFulfilled: false },
        { id: 'shayke', name: 'Shayke', artifactId: 'penguin', source: 'caveman', isAwake: false, isFulfilled: false },
    ],
    lastEra: 'playroom',
};

const artifactsData = {
    bottle: { name: 'Bottle', video: cavemanVideo, contour: Fire, hint: '___' },
    cube: { name: 'Cube', video: cavemanVideo, contour: Fire, hint: '___' },
    toothpaste: { name: 'Toothpaste', video: cavemanVideo, contour: Fire, hint: '___' },
    carrot: { name: 'Carrot', video: cavemanVideo, contour: Rock, hint: 'אבן פה, אבן שם, העיקר שהכוכבים מסתדרים בשורה', sol: 'חלוק נחל מעוטר, עורקן א-רוב' },
    viewmaster: { name: 'View-Master', video: cavemanVideo, contour: Tusk, hint: 'לצוד מהצד, צעד צעד, רק שלא יפיל אותי', sol: 'חט מסטודון, חולון' },
    penguin: { name: 'Penguin', video: cavemanVideo, contour: Fire, hint: 'טעם חדש ומעניין, להשגיח שלא יישרף', sol: 'צור שרוף, גשר בנות יעקב' }, // only this is correct
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
    const [stage, setStage] = useState('gallery');
    const [state, dispatch] = useReducer(ghostReducer, JSON.parse(localStorage.getItem('ghostsData')) || ghostsData);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const era = queryParams.get('era');
        setCurrentEra(era);
    }, [location]);

    useEffect(() => {
        if (currentEra) {
            setStage('gallery');
        }
    }, [currentEra])

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
        if (currentEra) {
            dispatch({ type: 'VISIT_ERA', era: currentEra });
        }
        setStage(stage === 'map' ? 'gallery' : 'map');
        // setCurrentEra(null);
    };

    const handleReset = () => {
        dispatch({ type: 'RESET' });
        setStage('gallery');
    };

    return (
        <>
            <GhostContext.Provider value={{ state, dispatch }}>
                <div style={{
                    height: '100svh',
                    width: '100vw',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    <ParallaxBackground />
                    {currentEra === null ? (
                        <TitleScanner setCurrentEra={() => navigate(`?era=playroom&awaken=true`)} />
                    ) : stage === 'map' ? (
                        <EraMap setCurrentEra={setCurrentEra} era={state.lastEra || 'playroom'} handleGoBackToMap={handleGoBackToMap} />
                    ) : (
                        <EraGallery era={currentEra} handleGoBackToMap={handleGoBackToMap} setCurrentEra={setCurrentEra} />
                    )}
                </div>
            </GhostContext.Provider>
            <PWABadge />
        </>
    );
};

const Shell = ({ ui, handleGoBackToMap, children, hideMuseum = false }) => {
    return (
        <>
            <main style={{ position: 'absolute', zIndex: 1, height: '75%', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {children}
            </main>
            <div style={{ pointerEvents: "none", position: 'absolute', zIndex: 2, height: '100svh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
                {!hideMuseum && <nav style={{ pointerEvents: "all", padding: '2em' }}>
                    <RoundButton symbol="museum" />
                </nav>}
                <footer style={{ marginTop: "auto", padding: '0.4em', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <nav style={{ pointerEvents: "all", display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
                        {ui}
                    </nav>
                </footer>
            </div>
        </>
    )
}

const TitleScanner = (({ setCurrentEra }) => {
    return (
        <Shell ui={[]} hideMuseum>
            <img src={titleSvg} style={{ width: '70%', flex: 1 }} />
            <div style={{ height: '40%', zIndex: 1, position: 'relative', flex: 1, margin: '1em 4em' }}>
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 0 0 0.2em white', borderRadius: 30 }}>
                    <VideoClassifier artifactId={'penguin'} handleFound={setCurrentEra} height={400} />
                    <div style={{
                        position: 'absolute',
                        top: 0, margin: 0, zIndex: 2, height: '100%', width: '110%'
                    }} className="bar-floating bar-fading" >
                        <div style={{
                            margin: '0 auto',
                            background: '#3bef75',
                            borderRadius: 5,
                            height: 5,
                            boxShadow: '0 0 5px 5px darkcyan',
                        }} />
                    </div>
                </div>
            </div>
        </Shell>
    )
})

// EraMap component
const EraMap = ({ era, handleGoBackToMap, setCurrentEra }) => {
    const renderUI = () => (
        <>
            {/* <Compass style={{ background: 'red', width: 200, height: 100 }} /> */}
            < nav style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignContent: 'center', height: 130, width: '100%', backgroundImage: `url(${Panel})`, backgroundSize: '100% 100%', backgroundPosition: 'center' }}>
                <RoundButton onClick={handleGoBackToMap} symbol="ghost" />
                <RoundButton symbol="inventory" />
                <RoundButton onClick={() => setCurrentEra(null)} symbol="scan" />
                {/* <button onClick={handleReset}>Reset</button> */}
            </nav >
        </>
    )
    return (
        <Shell ui={renderUI()}>
            <div style={{ margin: '3em' }} >
                <MapNew style={{ width: '100%', height: '100%' }} onClick={handleGoBackToMap} era={era} />
            </div>
        </Shell>
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
        <div onContextMenu={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%' }}>

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
                            style={{ position: 'relative', ...pos, aspectRatio: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <video autoPlay loop muted playsInline className="fading" style={{ width: '180%', height: '180%', objectFit: 'contain', transform, animationDelay, /* opacity: ghost.isFulfilled ? 0.2 : 0.6 */ }}>
                                <source src={ghostSourceKeys[ghost.source].hevc} type='video/mp4; codecs="hvc1"' />
                                <source src={ghostSourceKeys[ghost.source].vp9} type="video/webm" />
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
    const Comp = artifactsData[artifactId].contour;
    return (
        <div style={{ display: 'flex', flex: 1, gap: '5%', flexDirection: 'column', width: '100%' }}>
            <div style={{ display: 'flex', flexGrow: 0, height: 288, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: '1em', position: 'relative', flex: 1, width: '100%', margin: '1em 0 auto' }}>
                <video autoPlay loop muted playsInline style={{ right: 0, height: 120, top: 20, objectFit: 'contain', position: 'absolute' }}>
                    <source src={ghostSourceKeys[ghost.source].hevc} type='video/mp4; codecs="hvc1"' />
                    <source src={ghostSourceKeys[ghost.source].vp9} type="video/webm" />
                </video>
                <div style={{
                    width: '80%',
                    height: '100%',
                    // background: 'red',
                    backgroundImage: `url(${TextPanel})`,
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                }}>
                    {
                        ghost.isFulfilled
                            ? <p style={{ margin: '1em', padding: '1em', fontSize: '1.5rem', textAlign: 'center', color: '#0d0d0d' }}>{artifactsData[artifactId].sol}</p>
                            : <p style={{ margin: '1em', padding: '1em', fontSize: '1rem', textAlign: 'center', color: '#0d0d0d' }}>{artifactsData[artifactId].hint}</p>
                    }
                    <div style={{ width: 80 }} />
                </div>
            </div>
            {ghost.isFulfilled ? (
                <>
                    <div style={{ position: 'relative', flex: 3 }}>
                        <div className="hints" style={{
                            width: '100%',
                            height: '100%',
                            // background: 'blue',
                            backgroundImage: `url(${ObjectPanel})`,
                            backgroundSize: '100% 100%',
                            backgroundPosition: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <div className="video-container" style={{ width: '80%' }}>
                                <video style={{ width: '100%', margin: '0 auto', borderRadius: 30 }} src={artifactsData[artifactId].video} disablePictureInPicture autoPlay controls controlsList='nodownload noplaybackrate' playsInline />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div style={{ position: 'relative', flex: 3 }}>
                    <div className="hints" style={{
                        width: '100%',
                        height: '100%',
                        // background: 'blue',
                        backgroundImage: `url(${ObjectPanel})`,
                        backgroundSize: '100% 100%',
                        backgroundPosition: 'center'
                    }}>
                        <Comp style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 2 }} />
                    </div>
                </div>
            )}
            <div style={{ height: 100 }} />
        </div>
    )
};

// Search component
const Search = ({ ghost, artifactId, handleFound, handleReturn }) => {
    return (
        <>
            {/* <h1>Searching for {artifactsData[artifactId].name}</h1> */}
            <div style={{ margin: '1em 0.5em', alignItems: 'center' }} >
                {ghost.isFulfilled ? (
                    <p>Artifact already found!</p>
                ) : (
                    <VideoClassifier artifactId={artifactId} handleFound={handleFound} height={600} contour={artifactsData[artifactId].contour} />
                )}
            </div>
        </>
    )
};

// EraGallery component
const EraGallery = ({ era, handleGoBackToMap, setCurrentEra }) => {
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
        setCurrentStage('memory');
    }, [era]);

    console.log('Rendering EraGallery', { era, ghostsData, selectedGhost, currentStage })

    const handleFound = useCallback(() => handleFoundArtifact(selectedGhost), [selectedGhost]);

    const goToMemory = useCallback(() => setCurrentStage('memory'), []);
    const goToSearch = useCallback(() => setCurrentStage('search'), []);
    const goToGallery = useCallback(() => setCurrentStage('gallery'), []);

    const ghost = ghostsData[era].find(ghost => ghost.id === selectedGhost);

    const renderStage = () => {
        if (currentStage === 'gallery') {
            return <Gallery era={era} ghostsData={ghostsData} handleSelectGhost={handleSelectGhost} />;
        } else if (currentStage === 'memory') {
            return <Memory ghost={ghost} artifactId={ghost.artifactId} handleSearch={goToSearch} handleReturn={goToGallery} />;
        } else if (currentStage === 'search') {
            return <Search ghost={ghost} artifactId={ghost.artifactId} handleFound={handleFound} handleReturn={goToMemory} />;
        }
        // Add more stages as needed
    };

    const renderUI = () => (
        <>
            {currentStage === 'memory' && !ghost.isFulfilled && (
                <button className='button-test' onClick={goToSearch} style={{ width: '100%', height: '1%' }}>
                    <Eye />
                </button>
            )}
            {/* <Compass style={{ background: 'red', width: 200, height: 100 }} /> */}
            < nav style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignContent: 'center', height: 130, width: '100%', backgroundImage: `url(${Panel})`, backgroundSize: '100% 100%', backgroundPosition: 'center' }}>
                <RoundButton onClick={(handleGoBackToMap)} symbol="compass" />
                <RoundButton symbol="inventory" />
                {currentStage === 'gallery' ? <RoundButton onClick={() => setCurrentEra(null)} symbol="scan" /> : <RoundButton onClick={goToGallery} symbol="ghost" />}
                {/* <button onClick={handleReset}>Reset</button> */}
            </nav >
        </>
    )

    // return renderStage();
    return <Shell ui={renderUI()} handleGoBackToMap={handleGoBackToMap}>{renderStage()}</Shell>
};


export default App;
