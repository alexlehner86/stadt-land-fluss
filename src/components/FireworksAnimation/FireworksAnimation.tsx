import './FireworksAnimation.css';

import React, { useEffect, useState } from 'react';

interface FireworksAnimationProps {
    /** Duration in milliseconds */
    duration: number;
}
const FireworksAnimation: React.FunctionComponent<FireworksAnimationProps> = props => {
    const [showFireworks, setShowFireworks] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    useEffect(
        () => {
            const fireworksTimeouts = [
                setTimeout(() => setFadeOut(true), props.duration > 1000 ? props.duration - 1000 : 0),
                setTimeout(() => setShowFireworks(false), props.duration)
            ];
            // This will clear the timeouts when component unmounts like in willComponentUnmount
            return () => fireworksTimeouts.forEach(timeout => clearTimeout(timeout));
        },
        [] // Leave array empty so that useEffect will run only one time.
    );
    return showFireworks ? (
        <div className={'slf-fireworks-container' + (fadeOut ? ' fade-out' : '')}>
            <div className="slf-fireworks-before"></div>
            <div className="slf-fireworks-after"></div>
        </div>
    ) : null;
};

export default React.memo(FireworksAnimation);
