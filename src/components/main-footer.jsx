import React from 'react';

export default (ComposedComponent) => {
    return class MainFooter extends React.Component {
        constructor(props) {
            super(props);
        }

        render() {
            return (
                <div id="footer">
                    <ComposedComponent {...this.props} />
                </div>
            );
        }
    }
}
