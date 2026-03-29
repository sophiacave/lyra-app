export const get_secret = async (key) => {
    if (key === 'mflux_model_key') {
        return 'dummy-model-key';
    }
    throw new Error('Secret not found');
};
