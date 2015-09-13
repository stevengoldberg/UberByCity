import React, { Component } from 'react';
import { Link } from 'react-router';

import 'bootstrap-webpack';

// Global styles
import 'style!./styles/main.scss';

// Application components
import { Header } from 'components';

export default class Main extends Component {
    render() {
        return (
            <section>
                <Header />
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 col-ls-12">
                            <h1>Uber data:</h1>
                            <div className="btn-group" role="group" aria-label="...">
                                <Link to={`/chart/`}>
                                    <button type="button" className="btn btn-default">Load chart</button>
                                </Link>
                            </div>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
