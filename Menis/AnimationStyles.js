export const NORMAL  = "normal";
export const REVERSE = "reverse";
export const YOYO    = "yoyo";

export function getAnimationStyleFunc(style) {
    switch (style) {
        case NORMAL:
            return (frameIndex, frameCount) => (frameIndex + 1) % frameCount;
    
        case REVERSE:
            return (frameIndex, frameCount) => {
                frameIndex--;
    
                if (frameIndex < 0)
                    return Math.max(frameCount - 1, 0);
    
                return frameIndex;
            };;
    
        case YOYO:
            let incrementer = 1;
            return (frameIndex, frameCount) => {
                frameIndex += incrementer;
    
                if (frameIndex <= 0 || frameIndex >= frameCount - 1)
                    incrementer *= -1;
    
                return frameIndex;
            };
    }
};