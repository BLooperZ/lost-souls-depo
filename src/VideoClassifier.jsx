import React, { useEffect, useRef, useState } from 'react';
import ml5 from 'ml5';

import './VideoClassifier.css';

const imageModelURL = 'https://teachablemachine.withgoogle.com/models/kXD1UtbaY/';

const useMl5Model = (modelURL) => {
    const [model, setModel] = useState(null);

    useEffect(() => {
        ml5.imageClassifier(modelURL)
            .then(cls => {
                setModel(cls);
            })
            .catch(error => {
                console.error('Could not load ml5 model:', error);
            });
    }, [modelURL]);

    return model;
};

const VideoClassifier = ({ artifacts, handleFound, height, contour: Contour }) => {
    const videoRef = useRef();
    const canvasRef = useRef();
    // const containerRef = useRef();
    const labelRef = useRef();
    const [label, setLabel] = useState('');
    const classifier = useMl5Model(imageModelURL + 'model.json');

    const [ticks, setTicks] = useState(0);

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        // const container = containerRef.current;

        let stream;

        // Start loading the camera first
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
            .then(strm => {
                stream = strm;
                video.srcObject = stream;
                video.play();

                requestAnimationFrame(draw);
            })
            .catch(error => {
                console.error('Could not start video source:', error);
            });

        // Draw the video frame to the canvas
        function draw() {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            requestAnimationFrame(draw);
        }

        // const resizeCanvas = () => {
        //     const bounds = container.getBoundingClientRect();
        //     // canvas.width = entry.contentRect.width;
        //     // canvas.height = entry.contentRect.height;
        //     canvas.width = bounds.width;
        //     canvas.height = bounds.height;

        //     draw();
        // }

        // resizeCanvas();

        // const resizeObserver = new ResizeObserver(([entry]) => {
        //     resizeCanvas();

        //     console.log({ bounds })

        //     draw();
        // });

        // resizeObserver.observe(container);

        // Cleanup function
        return () => {
            // Stop all tracks of the stream
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        let intervalId;

        let sticks = 0;

        // Classify each frame when the canvas is updated
        if (classifier) {
            intervalId = setInterval(() => {
                classifier.classify(canvas, gotResult);
            }, 500); // Run classification every second
        }

        // Handle the classification result
        function gotResult(error, results) {
            if (error) {
                console.error(error);
                return;
            }
            if (results[0].confidence > 0.85) {
                setLabel(results[0].label);
                labelRef.current = results[0].label;
            } else {
                setLabel('...');
                labelRef.current = '...';
            }
            if (artifacts.includes(labelRef.current)) {
                sticks += 1;
            } else if (sticks > 0) {
                sticks -= 1;
            }
            setTicks(sticks);
        }

        // Cleanup function
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [artifacts, handleFound, classifier]);

    useEffect(() => {
        if (ticks === 5) {
            handleFound();
        }
    }, [ticks, handleFound]);

    const detected = ticks > 1 ? {className: 'detected'} : {};

    return (
        <>
            <div className="video-container">
                {/* <div ref={containerRef} style={{position: 'relative', width: '100%', height: '100%' }}> */}
                <video ref={videoRef} style={{ display: 'none' }}></video>
                {/* <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }}></canvas> */}
                <canvas ref={canvasRef}
                    width={400}
                    height={height}
                // style={{ position:'absolute', inset: 0 }}
                ></canvas>
                {Contour &&
                    <div className="contour" style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignContent: 'center', justifyContent: 'center', flexDirection: 'column', gap: 0 }}>
                        <div style={{ flex: 1, background: 'rgba(32, 146, 55, 0.5)', boxShadow: '0 0 0 1px rgba(32, 146, 55, 0.5)', borderTopLeftRadius: 30, borderTopRightRadius: 30 }} />
                        <Contour style={{boxShadow: '0 0 0 1px rgba(32, 146, 55, 0.5)'}} {...detected} />
                        <div style={{ flex: 1, background: 'rgba(32, 146, 55, 0.5)', boxShadow: '0 0 0 1px rgba(32, 146, 55, 0.5)', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }} />
                    </div>
                }
            </div>
            <div className="results-overlay">
                <p>{label} - {ticks}</p>
            </div>
        </>
    );
};

// <VideoClassifier style={{ width: '100%', height: '60%' }} />

export default VideoClassifier;
