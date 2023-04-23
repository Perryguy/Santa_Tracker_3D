export const height_Generator = (function () {
    class HeightGenerator {
        constructor(generator, position, minRadius, maxRadius) {
            this._position = position.clone();
            this._radius = [minRadius, maxRadius];
            this._generator = generator;
        }
        
    
        Get(x, y) {
            return [this._generator.Get(x, y), 1];
        }
    }
    return {
        HeightGenerator: HeightGenerator,
    };
})();