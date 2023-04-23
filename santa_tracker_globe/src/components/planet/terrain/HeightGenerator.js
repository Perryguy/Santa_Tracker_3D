export const height_Generator = (function () {
    class HeightGenerator {
        constructor(generator, position, minRadius, maxRadius) {
            this._position = position.clone();
            this._radius = [minRadius, maxRadius];
            this._generator = generator;
        }
        
    
        Get(x, y, width, offset) {
            return [this._generator.Get(x, y, width, offset), 1];
        }
    }
    return {
        HeightGenerator: HeightGenerator,
    };
})();