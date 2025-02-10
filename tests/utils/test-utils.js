import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../app/store';

const AllTheProviders = ({ children }) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};

const customRender = (ui, options) =>
    render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render }; 