import './CompassButton.css'

const CompassButton = () => (
    <svg width="70" height="70" id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 170.3 170.3">
        <defs>
            <filter id="drop-shadow-1" filterUnits="userSpaceOnUse">
                <feOffset dx="0" dy="3" />
                <feGaussianBlur result="blur" stdDeviation="0" />
                <feFlood floodColor="#000" floodOpacity=".7" />
                <feComposite in2="blur" operator="in" />
                <feComposite in="SourceGraphic" />
            </filter>
            <linearGradient id="linear-gradient" x1="4" y1="85.15" x2="166.3" y2="85.15" gradientUnits="userSpaceOnUse">
                <stop offset=".11" stopColor="#1cd9c7" />
                <stop offset="1" stopColor="#27b9b5" />
            </linearGradient>
            <linearGradient id="New_Gradient_Swatch_5" data-name="New Gradient Swatch 5" x1="0" y1="85.15" x2="170.3" y2="85.15" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#743f38" />
                <stop offset=".47" stopColor="#7c513c" />
                <stop offset="1" stopColor="#ebe19b" />
            </linearGradient>
            <filter id="drop-shadow-1-2" data-name="drop-shadow-1" filterUnits="userSpaceOnUse">
                <feOffset dx="0" dy="3" />
                <feGaussianBlur result="blur-2" stdDeviation="0" />
                <feFlood floodColor="#000" floodOpacity=".7" />
                <feComposite in2="blur-2" operator="in" />
                <feComposite in="SourceGraphic" />
            </filter>
        </defs>
        <g id="buttons_2">
            <g>
                <g>
                    <circle className="cls-1" cx="85.15" cy="85.15" r="81.15" />
                    <circle className="cls-4" cx="85.15" cy="85.15" r="81.15" />
                </g>
                <path className="cls-2" d="M123.43,85.15l-30.39-4.05,12.48-16.32-16.32,12.48-4.05-30.39-4.05,30.39-16.32-12.48,12.48,16.32-30.39,4.05,30.39,4.05-12.48,16.32,16.32-12.48,4.05,30.39,4.05-30.39,16.32,12.48-12.48-16.32,30.39-4.05ZM85.15,90.25c-2.82,0-5.1-2.29-5.1-5.1s2.29-5.1,5.1-5.1,5.1,2.29,5.1,5.1-2.29,5.1-5.1,5.1Z" />
                <path className="cls-3" d="M81.13,37.03c-.08-.08-.11-.17-.11-.29v-1.44c0-.11.04-.21.11-.29s.17-.11.29-.11h5.81c-.01-.13-.06-.23-.13-.3s-.2-.18-.38-.3-.32-.23-.42-.3l-2.09-1.5c-.66-.48-1.15-.9-1.48-1.25-.33-.35-.56-.73-.69-1.12s-.2-.88-.2-1.46v-.46h-1.16c-.11,0-.21-.04-.29-.11s-.11-.17-.11-.29v-1.39c0-.11.04-.21.11-.29s.17-.11.29-.11h2.62c.23,0,.42.08.58.24.16.16.24.35.24.58v1.82c0,.32.05.58.16.8.11.21.29.43.54.65.25.22.66.53,1.23.95.52-.25.9-.55,1.15-.9s.37-.76.37-1.25v-.7h-1.16c-.11,0-.21-.04-.29-.11s-.11-.17-.11-.29v-1.39c0-.11.04-.21.11-.29s.17-.11.29-.11h2.62c.23,0,.42.08.58.24.16.16.24.35.24.58v1.65c0,.9-.17,1.65-.52,2.26-.35.61-.9,1.11-1.64,1.5.72.53,1.21,1.01,1.47,1.43.26.42.39.95.39,1.59v1.01c0,.24-.08.45-.25.62-.17.17-.37.26-.63.26h-7.26c-.11,0-.21-.04-.29-.11Z" />
            </g>
        </g>
    </svg>
);

export default CompassButton;