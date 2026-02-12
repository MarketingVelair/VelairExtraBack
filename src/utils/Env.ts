const env = process.env.NODE_ENV;

export enum EnvTypes {
    PRODUCTION,
    DEVELOPMENT
}
export default {
    env: env == "production" ? EnvTypes.PRODUCTION : EnvTypes.DEVELOPMENT,
    types: EnvTypes
};