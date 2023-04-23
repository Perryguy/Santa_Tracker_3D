export const height_map_generator = (function () {
    class HeightMapGenerator {
        constructor(heightMapdata) {
            // Initialize your 3D scene here, and use heightGenerator as a height generator
            this.heightMapData = heightMapdata;
            this.width = 16384;
            this.height = 8192;
            this.minHeight = 0;
            this.maxHeight = 8000;
        }

        Get(x, y) {
            const xf = ((x + this.width / 2) / this.width) * (this.width - 1);
            const yf = ((y + this.height / 2) / this.height) * (this.height - 1);
        
            // Get the integer and fractional parts of the coordinates
            const x1 = Math.floor(xf);
            const y1 = Math.floor(yf);
            const x2 = (x1 + 1) % this.width;
            const y2 = (y1 + 1) % this.height;
            const fx = xf - x1;
            const fy = yf - y1;
        
            // Get the height values at the surrounding pixels
            const h1 = this.heightMapData[y1 * this.width + x1];
            const h2 = this.heightMapData[y1 * this.width + x2];
            const h3 = this.heightMapData[y2 * this.width + x1];
            const h4 = this.heightMapData[y2 * this.width + x2];
        
            // Perform bilinear interpolation
            const height = h1 * (1 - fx) * (1 - fy) + h2 * fx * (1 - fy) + h3 * (1 - fx) * fy + h4 * fx * fy;
        
            return height;
        }
    }
    return {
        HeightMapGenerator: HeightMapGenerator,
    };
})();
