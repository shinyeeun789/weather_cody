import * as React from 'react';
import ProductCategories from '../modules/views/ProductCategories';
import AppFooter from '../modules/views/AppFooter';
import CurrentWeather from '../modules/views/CurrentWeather';
import ProductHowItWorks from '../modules/views/ProductHowItWorks';
import AppAppBar from '../modules/views/AppAppBar';
import withRoot from '../modules/withRoot';
import {ToastContainer} from "react-toastify";

function Index() {
    return (
        <React.Fragment>
            <ToastContainer/>
            <AppAppBar />
            <CurrentWeather />
            <ProductCategories />
            <ProductHowItWorks />
            <AppFooter />
        </React.Fragment>
    );
}

export default withRoot(Index);