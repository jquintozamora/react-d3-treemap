import * as React from 'react';
import * as TransitionGroup from 'react-addons-transition-group';
export interface IAnimationsTestState {
    shouldShowBox: boolean;
};

export class AnimationsTest extends React.Component<{}, IAnimationsTestState> {

    constructor(props: any, context: any) {
        super(props, context);

        // Default State values
        this.state = {
            shouldShowBox: true

        };
    }



    public render() {
        return (
            <div className="page">
                <button
                    className="toggle-btn"
                    onClick={this.toggleBox}
                >
                    toggle
                </button>
                <TransitionGroup>
                    {this.state.shouldShowBox && <div style={{ padding: "40px", border: "1px solid black" }} className="box" />}
                </TransitionGroup>
            </div>);
    }

    private toggleBox = () => {
        this.setState({
            shouldShowBox: !this.state.shouldShowBox
        });
    }

}

