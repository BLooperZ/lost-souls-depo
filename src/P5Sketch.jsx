import { useEffect, useRef } from 'react';
import p5 from 'p5';

const P5Sketch = ({ sketch, ...props }) => {
    const renderRef = useRef();
    let p5Instance;

    useEffect(() => {
        p5Instance = new p5(sketch, renderRef.current);
        p5Instance.props = props;

        // Cleanup function
        return () => {
            // if (!p5Instance?.canvas) return;
            // // Remove any event listeners added by the sketch
            // p5Instance.canvas.removeEventListener('mousemove', p5Instance.mouseMoved);
            // p5Instance.canvas.removeEventListener('mousedown', p5Instance.mousePressed);
            // p5Instance.canvas.removeEventListener('mouseup', p5Instance.mouseReleased);
            // p5Instance.canvas.removeEventListener('click', p5Instance.mouseClicked);
            // p5Instance.canvas.removeEventListener('wheel', p5Instance.mouseWheel);

            // // Remove the canvas
            // if (p5Instance.canvas) p5Instance.canvas.remove();

            // Remove the p5 instance
            p5Instance.remove();
        };
    }, [sketch, props]);

    return <div ref={renderRef}></div>;
};

export default P5Sketch;
