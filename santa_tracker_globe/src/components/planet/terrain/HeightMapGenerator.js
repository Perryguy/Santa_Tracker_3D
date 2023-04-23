export const height_map_generator = (function () {
    class HeightMapGenerator {
        constructor(heightMapdata) {
            // Initialize your 3D scene here, and use heightGenerator as a height generator
            this.heightMapData = heightMapdata;
            this.width = 16384;
            this.height = 8192;
        }

        Get(u, v, width, offset) {
            const pixelX = Math.floor((u * width + offset.x) % this.width);
            const pixelY = Math.floor((v * width + offset.y) % this.height);

            const index = pixelY * this.width + pixelX;
            const height = this.heightMapData[index];
            return height;
        }
    }
    return {
        HeightMapGenerator: HeightMapGenerator,
    };
})();
