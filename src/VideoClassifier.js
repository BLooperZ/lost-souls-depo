import { useState, useEffect, useRef } from 'react';
import useInterval from '@use-it/interval';
import ml5 from 'ml5';

const imageModelURL = 'https://teachablemachine.withgoogle.com/models/s379EsNn/';


export default () => {
    const videoRef = useRef();
    const [start, setStart] = useState(false);
    const [result, setResult] = useState([]);
    const [loaded, setLoaded] = useState(false);

    let classifier;

    useEffect(() => {
        classifier = ml5.imageClassifier(imageModelURL + 'model.json', () => {
            navigator.mediaDevices
                .getUserMedia({ video: { facingMode: "environment" }, audio: false })
                .then((stream) => {
                    videoRef.current.srcObject = stream;
                    const playPromise = videoRef.current.play();
                    if (playPromise !== undefined) {
                        playPromise.then(_ => {
                            // Automatic playback started!
                            // Show playing UI.

                            setLoaded(true);
                        })
                            .catch(error => {
                                // Auto-play was prevented
                                // Show paused UI.
                            });
                    }
                });
        });
    }, []);

    useInterval(() => {
        if (classifier && start) {
            classifier.classify(videoRef.current, (error, results) => {
                if (error) {
                    console.error(error);
                    return;
                }
                setResult(results);
                // console.log(results)
            });
        }
    }, 500);

    const toggle = () => {
        setStart(!start);
        setResult([]);
    }

    return (
        <div className="container">
            <div className="upper">
                <div className="capture">
                    <video
                        ref={videoRef}
                        style={{ transform: "scale(-1, 1)" }}
                        width="100vw"
                        height="100vh"
                    />
                </div>
            </div>
            <div className="results">
                <p>{result} - dsfdsfdsfds</p>
            </div>
        </div>
    );
}