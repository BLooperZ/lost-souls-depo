import ParallaxBackground from './parallaxBackground';


import backgroundImage from '../assets/Background_2.jpg';
import fog1 from '../assets/smoke_1.png';
import fog2 from '../assets/smoke_2.png';

const meta = {
  component: ParallaxBackground,
};

export default meta;

export const Default = {
  render: () => (
    <ParallaxBackground
    // backgroundImage={backgroundImage} fog1={fog1} fog2={fog2}
    />
  ),
};
