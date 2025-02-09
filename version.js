export const VERSION = {
    major: 1,
    minor: 0,
    patch: 0,
    build: process.env.BUILD_NUMBER || '0',
    toString() {
        return `${this.major}.${this.minor}.${this.patch}-${this.build}`;
    }
}; 