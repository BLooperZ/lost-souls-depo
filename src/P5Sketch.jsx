import { useEffect, useRef } from 'react';
import p5 from 'p5';

const P5Sketch = ({sketch}) => {
    const renderRef = useRef();

    useEffect(() => {
        new p5(sketch)
    }, [sketch])

    return(
        <div ref={renderRef}></div>
    )
}

export default P5Sketch;
