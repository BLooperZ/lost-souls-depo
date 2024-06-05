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

const VideoClassifier = ({ artifactId, handleFound }) => {
    const videoRef = useRef();
    const canvasRef = useRef();
    const labelRef = useRef();
    const [label, setLabel] = useState('');
    const classifier = useMl5Model(imageModelURL + 'model.json');

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

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

        // Classify each frame when the canvas is updated
        if (classifier) {
            intervalId = setInterval(() => {
                classifier.classify(canvas, gotResult);
            }, 1000); // Run classification every second
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
            if (labelRef.current === artifactId) {
                handleFound();
            }
        }

        // Cleanup function
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [artifactId, handleFound, classifier]);

    return (
        <div>
            <div className="video-container">
                <video ref={videoRef} style={{ display: 'none' }}></video>
                <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
            </div>
            <div className="results-overlay">
                <p>{label}</p>
            </div>
        </div>
    );
};

export default VideoClassifier;
